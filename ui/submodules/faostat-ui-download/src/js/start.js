/*global define, console, amplify */
define([
        'jquery',
        'loglevel',
        'config/Config',
        'config/Events',
        'config/Analytics',
        'globals/Common',
        'text!fs-i-d/html/templates.hbs',
        //'text!fs-i-d/html/formlogin.hbs',
        'i18n!nls/download',
        'fs-s-m/start',
        'fs-d-o/start',
        'fs-t-c/table',
        'FAOSTAT_UI_PIVOT',
        'pivot_exporter',
        'faostatapiclient',
        'handlebars',
        'underscore',
        'amplify',
        'bootstrap'
    ],
    function ($, log,
              C, E, A,
              Common, template, i18nLabels,
              SelectorManager,
              DownloadOptions,
              Table,
              FAOSTATPivot,
              PivotExporter,
              API,
              Handlebars,
              _
    ) {

            'use strict';

            var exp_options = {};

            var s = {
                   // MODAL_POPUP: '#main_structure',
                   ///// MODAL_LOGIN: '#popup-login-modal',

                    INFO_FORM_MODAL: "#infoForm_modal",
                    INFO_FORM_MODAL_CONTENT_BODY: "#infoForm_modal_contentBody",
                    INFO_FORM_SUBMIT: "#infoFormSubmit",






                    SELECTORS: '[data-role="selectors"]',
                    OPTIONS: '[data-role="options"]',
                    EXPORT_BUTTON: '[data-role="export"]',
                    PREVIEW_BUTTON: '[data-role="preview"]',

                    // this could be customized if configured in config.
                    OUTPUT: {
                        //CONTAINER: '[data-role="output-area"]',
                        // table/pivot
                        CONTENT: '[data-role="content"]',
                        MESSAGE: '[data-role="message"]',

                        // this could also not been needed
                        EXPORT: '[data-role="export"]'
                    },

                    // this is used to check if the pivot table is rendered or not
                    PIVOT_TABLE: '[data-role="pivot"]',

                },
                defaultOptions = {

                    // TODO: move to config/Download
                    TABLE: {
                        MAX_ROWS: 250000, // 250000 ~40/50MB?
                        //MAX_ROWS: 500000, // 500000 ~60/80MB
                        //MAX_ROWS: 350000, // export: 300000 ~50/60MB (13sec query). query page: 9sec.
                        PAGE_SIZE: 100,
                        PAGE_NUMBER: 1,
                        PAGE_LIST: "[25, 50, 100, 250]"
                    },

                    PIVOT: {
                        //MAX_ROWS: 1500,
                        MAX_ROWS: 15000,
                        //MAX_ROWS: 25000,

                        // this is due of how the pivot is rendered
                        // it requires all the fields
                        REQUEST_FIXED_PARAMETERS: {
                            show_flags: true,
                            show_codes: true,
                            show_unit: true,
                            pivot: true
                        }
                    },

                    DEFAULT_REQUEST: {
                        /*  limit:-1,
                         page_size: 0,
                         per_page: 0,
                         page_number: -1,
                         null_values: false,
                         show_flags: true,
                         show_codes: true,
                         show_unit: true,*/
                    }

                };

            function InteractiveDownload() {

                return this;
            }

            InteractiveDownload.prototype.init = function (config) {

                this.o = $.extend(true, {}, defaultOptions, config);

                log.info("InteractiveDownload.init; o:", this.o);

                this.initVariables();
                this.initComponents();
                this.configurePage();
                this.bindEventListeners();

            };
            InteractiveDownload.prototype.checkEmail = function (emailCheck) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(emailCheck);
            }
            InteractiveDownload.prototype.checkValueCookies = function (nameCoockie) {
                var name = nameCoockie + "=";
                var ca = document.cookie.split(';');
               // alert('name'+name);
                //alert('ca'+ca);
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ')
                        c = c.substring(1);
                   //alert(c.substring(name.length, c.length));
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";
            }
            InteractiveDownload.prototype.initVariables = function () {


                var html = $(template).filter('#main_structure').html(),
                    t = Handlebars.compile(html);


                this.$infoFormModal =   $(template).filter(s.INFO_FORM_MODAL).html();

                //this.$MODALLogin = $(s.MODAL_LOGIN);

               // console.log(this)
                //console.log(this.$el)
               // this.$infoFormContentBody = this.$el.find(s.INFO_FORM_MODAL_CONTENT_BODY)

                //this.$infoFormContentBody = this.$el.find(s.INFO_FORM_MODAL_CONTENT_BODY);


                this.$CONTAINER = $(this.o.container);

                this.$CONTAINER.html(t(i18nLabels));

                this.$SELECTORS = this.$CONTAINER.find(s.SELECTORS);
                this.$EXPORT_BUTTON = this.$CONTAINER.find(s.EXPORT_BUTTON);
                this.$PREVIEW_BUTTON = this.$CONTAINER.find(s.PREVIEW_BUTTON);
                this.$OPTIONS = this.$CONTAINER.find(s.OPTIONS);


                this.$CHECKCOOCKIE = this.checkEmail(this.checkValueCookies('myUserCookie'));
                // output_area
                // this.$OUTPUT_AREA = this.$CONTAINER.find(s.OUTPUT_AREA);

                this.$OUTPUT_CONTAINER = $(this.o.output_container);

              /////  this.$OUTPUT__POPUP_CONTAINER = $(s.MODAL_POPUP);


                // if this.o.output_area
                if (this.o.hasOwnProperty('output') && this.o.output.hasOwnProperty('container')) {

                    this.$OUTPUT_CONTAINER = $(this.o.output.container);

                    // show the container
                    this.$OUTPUT_CONTAINER.show();

                    this.$OUTPUT_CONTENT = this.$OUTPUT_CONTAINER.find(s.OUTPUT.CONTENT);
                    this.$OUTPUT_MESSAGE = this.$OUTPUT_CONTAINER.find(s.OUTPUT.MESSAGE);
                    this.$OUTPUT_EXPORT = this.$OUTPUT_CONTAINER.find(s.OUTPUT.EXPORT);

                }

            };

            InteractiveDownload.prototype.initComponents = function () {

                var code = this.o.code;

                amplify.publish(E.LOADING_SHOW, {container: this.$SELECTORS});

                // Init Selector Manager
                this.selectorsManager = new SelectorManager();
                this.selectorsManager.init({
                    container: this.$SELECTORS,
                    code: code
                });

                // Init Download Options
                this.downloadOptions = new DownloadOptions();
                this.downloadOptions.init({
                    container: this.$OPTIONS
                });

                this.downloadOptions.show_as_panel();

            };

            InteractiveDownload.prototype.configurePage = function () {

            };

            InteractiveDownload.prototype.getOnboardingSteps = function() {

                var self = this;

                return [
                        {
                            intro: '<h4>Filter the data</h4>Select from the filter boxes exactly what you need',
                            element: '[data-role="selector"]',
                            target: self.$SELECTORS
                        },
                        {
                            intro: "<h4>Show Data</h4><i>Click Here</i> after the selection if you want to preview your data",
                            element: self.$PREVIEW_BUTTON
                        },
                        {
                            intro: "<h4>Download Data</h4>or <i>Click Here</i> if you want to download your data",
                            element: self.$EXPORT_BUTTON
                        }
                    ]

            };

            InteractiveDownload.prototype.preview = function () {

                var requestObj = this.getRequestObject(),
                    options = this.downloadOptions.getSelections(),
                    type = options.type,
                    self = this;

                amplify.publish(E.WAITING_SHOW);

                log.info("InteractiveDownload.preview; ", type, options);
                log.info("InteractiveDownload.preview; requestObj", requestObj);

                try {
                    // get query size
                    API.data($.extend(true, {}, requestObj, {
                        no_records: true
                    })).then(function (d) {

                        if(self.checkDataSize(d)) {

                            switch (type) {
                                case "table":
                                    self.previewTable(d, requestObj, options);
                                    break;
                                case "pivot":
                                    self.previewPivot(d, requestObj, options);
                                    break;
                            }
                        }

                    }).fail(function (e) {
                        log.error("InteractiveDownload.preview; ", e);
                        amplify.publish(E.WAITING_HIDE);
                        amplify.publish(E.NOTIFICATION_WARNING, {title: i18nLabels.error_preview});
                    });

                }catch(e) {
                    log.error("InteractiveDownload.preview; ", e);
                    amplify.publish(E.WAITING_HIDE);
                }

            };

            InteractiveDownload.prototype.previewTable = function (d, requestObj, options) {

                log.info(" InteractiveDownload.previewTable size:", d);

                var rowsNumber = d.data[0].NoRecords,
                    show_flags = (requestObj.show_flags === true)? true : false,
                    show_codes = (requestObj.show_codes === true)? true : false,
                    show_units = (requestObj.show_unit === true)? true : false,
                    thousand_separator = options.options.thousand_separator,
                    decimal_separator = options.options.decimal_separator,
                    querySizeCheck = rowsNumber <= this.o.TABLE.MAX_ROWS,
                    self = this,
                    // Override of the Request with Fixed parameters
                    r = $.extend(true, {}, requestObj, {}); //this.o.PIVOT.REQUEST_FIXED_PARAMETERS);

                // initializing request
                r.page_number = this.o.TABLE.PAGE_NUMBER;
                r.page_size = this.o.TABLE.PAGE_SIZE;


                log.info("InteractiveDownload.previewTable; requestObj", requestObj, options);

                // analytics
                this.analyticsTablePreview({
                    querySizeCheck: querySizeCheck,
                    querySize: rowsNumber
                });

                // check if data size is right
                if(querySizeCheck) {

                    log.info("InteractiveDownload.previewTable; r", r);

                    // Table
                    API.data(r).then(function(d) {

                        amplify.publish(E.SCROLL_TO_SELECTOR, {
                            container: self.$OUTPUT_CONTAINER,
                            paddingTop: 0,
                            force: true,
                            forceInvisible: true
                        });

                        // change output state
                        self.stateOutputInPreview();

                        //amplify.publish(E.WAITING_HIDE, {});

                        // TODO: the Table requires to be simplified and a refactoring!
                        // TODO: config should be moved to a configuration file
                        var table = new Table();
                        table.render({
                            model: d,
                            request: r,
                            container: self.$OUTPUT_CONTENT,
                            adapter: {
                                columns: [],
                                show_flags: show_flags,
                                show_codes: show_codes,
                                show_unit: show_units,
                                thousand_separator: thousand_separator,
                                decimal_separator: decimal_separator
                            },
                            template: {
                                height: '650',
                                tableOptions: {
                                    'data-pagination': true,
                                    'data-sortable': false,
                                    'data-page-size': self.o.TABLE.PAGE_SIZE,
                                    'data-page-list':  self.o.TABLE.PAGE_LIST,
                                    'data-side-pagination': 'server'
                                    //'data-ajax': 'ajaxRequest'
                                },
                                sortable: false,
                                addPanel: false,
                                ajax: function(request) {
                                    $.ajax({
                                        url: "",
                                        method: "",
                                        dataType: "",
                                        success: function () {
                                        },
                                        error: function(data) {
                                            log.error(JSON.stringify(data));
                                        },
                                        complete: function (){

                                            amplify.publish(E.WAITING_SHOW, {});

                                            var limit = request.data.limit,
                                                offset = request.data.offset,
                                                pageNumber = (offset / limit) + 1,
                                                pageSize = limit;

                                            // alter base request
                                            r.page_number = pageNumber;
                                            r.page_size = pageSize;

                                            log.info("InteractiveDownload.previewTable; limit, offset: ", limit, offset);
                                            log.info("InteractiveDownload.previewTable; page_size, page_number: ", pageSize, pageNumber);
                                            log.info("InteractiveDownload.previewTable; New request: ", (( pageSize !== self.o.TABLE.PAGE_SIZE && pageNumber === 1) || pageNumber !== 1));

                                            // if is it not the cached model
                                            if (( pageSize !== self.o.TABLE.PAGE_SIZE && pageNumber === 1) || pageNumber !== 1) {
                                                API.data(r).then(function (v) {

                                                    amplify.publish(E.WAITING_HIDE, {});

                                                    request.success({
                                                        total: rowsNumber,
                                                        rows: table.formatData(v)
                                                    });
                                                    request.complete();
                                                }).fail(function (e) {
                                                    log.error("InteractiveDownload.previewTable; ", e);
                                                    amplify.publish(E.WAITING_HIDE);
                                                    amplify.publish(E.NOTIFICATION_WARNING, {title: i18nLabels.error_preview});                                            });
                                            }else {

                                                log.info("InteractiveDownload.previewTable; cached model", d);

                                                amplify.publish(E.WAITING_HIDE, {});

                                                // cached page 1
                                                request.success({
                                                    total: rowsNumber,
                                                    rows: table.formatData(d)
                                                });
                                                request.complete();

                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }).fail(function (e) {
                        log.error("InteractiveDownload.previewTable; ", e);
                        amplify.publish(E.WAITING_HIDE);
                        amplify.publish(E.NOTIFICATION_WARNING, {title: i18nLabels.error_preview});
                    });
                }
                else {
                    this.suggestBulkDownloads();
                }

            };

            InteractiveDownload.prototype.previewPivot = function (d, requestObj, options, exportPivot) {

                var rowsNumber = d.data[0].NoRecords,
                    show_flags = (requestObj.show_flags === true)? true : false,
                    show_codes = (requestObj.show_codes === true)? true : false,
                    show_units = (requestObj.show_unit === true)? true : false,
                    render = (exportPivot !== undefined || exportPivot === true)? false : true,
                    thousand_separator = options.options.thousand_separator,
                    decimal_separator = options.options.decimal_separator,
                    querySizeCheck = rowsNumber <= this.o.PIVOT.MAX_ROWS,
                    self = this,

                    // Override of the Request with Fixed parameters
                    r = $.extend(true, {}, requestObj, this.o.PIVOT.REQUEST_FIXED_PARAMETERS);


                log.info(' InteractiveDownload.previewPivot; request:', r);

                // analytics (preview or download depending if the table will be rendered)
                //TODO: this should be fixed with a proper pivot table.
                if (render === true) {
                    this.analyticsPivotPreview({
                        querySizeCheck: querySizeCheck,
                        querySize: rowsNumber
                    });
                }else {
                    this.analyticsPivotDownload({
                        querySizeCheck: querySizeCheck,
                        querySize: rowsNumber
                    });
                }

                // check if data size is right
                if(querySizeCheck) {

                    API.data(r).then(function(d) {

                        amplify.publish(E.SCROLL_TO_SELECTOR, {
                            container: self.$OUTPUT_CONTAINER,
                            paddingTop: 0,
                            force: true,
                            forceInvisible: true
                        });


                        log.info('InteractiveDownload.previewPivot; data:', d);
                        log.info('InteractiveDownload.previewPivot; render:', render);

                        try {
                            // preview pivot
                            var pivotTable = new FAOSTATPivot();
                            pivotTable.init({
                                container: self.$OUTPUT_CONTENT,
                                data: d.data,
                                dsd: d.metadata.dsd,
                                show_flags: show_flags,
                                show_codes: show_codes,
                                show_units: show_units,
                                render: render,
                                thousand_separator: thousand_separator,
                                decimal_separator: decimal_separator
                            });

                            // export hidden table
                            if (render === false) {

                                var timer = setInterval(function () {
                                    if (self.checkIfPivotRendered()) {
                                        clearInterval(timer);
                                        var pivotExporter = new PivotExporter({
                                            container: self.$OUTPUT_CONTENT,
                                            // TODO: consistent filename
                                            filename: 'FAOSTAT'
                                        });

                                        log.info('exportPivot.options', options);
                                        (options.file == "csv") ? pivotExporter.csv() : pivotExporter.xls();

                                    }
                                }, 100);
                            } else {
                                // change output state
                                self.stateOutputInPreview();
                            }

                        }catch(e) {
                            // TODO: show an error message?
                            amplify.publish(E.WAITING_HIDE, {});
                            log.error('InteractiveDownload.previewPivot; error:', e);
                        }

                        amplify.publish(E.WAITING_HIDE, {});

                    }).fail(function (e) {
                        log.error("InteractiveDownload.previewPivot; ", e);
                        amplify.publish(E.WAITING_HIDE);
                        amplify.publish(E.NOTIFICATION_WARNING, {
                            title: i18nLabels.error_preview
                        });
                    });

                }
                else {
                    this.suggestBulkDownloadsOrTable();
                }

            };

            InteractiveDownload.prototype.export = function () {


                var requestObj = this.getRequestObject(),
                    isCookieUser=this.$CHECKCOOCKIE,
                    options = this.downloadOptions.getSelections(),
                    type = options.type,
                    self = this;



                amplify.publish(E.WAITING_SHOW);

                try {
                    // get query size
                    API.data($.extend(true, {}, requestObj, {
                        no_records: true
                    })).then(function (d) {

                        log.info('options', options);

                        if (self.checkDataSize(d)) {
                            exp_options = {
                                d: d,
                                requestObj: requestObj,
                                options: options,
                                typeDownload: type
                            };


                           /* var readValue = InteractiveDownload.prototype.getCookie('myUserCookie');
                            if (readValue==""){
                                InteractiveDownload.prototype.showModal();
                            }else{
                                if (exp_options.typeDownload == "table"){
                                    self.exportTable(exp_options.d, exp_options.requestObj, exp_options.options);
                                }else if (exp_options.typeDownload == "pivot") {
                                    self.exportPivot(exp_options.d, exp_options.requestObj, exp_options.options);
                                }
                            }*/


                          switch (type) {

                                case "table":
                                    self.exportTable(d, requestObj, options);
                                    break;
                                case "pivot":
                                    self.exportPivot(d, requestObj, options);
                                    break;
                                    /*
                                case "excel":
                                    self.exportExcel(d, requestObj, options);
                                    break;
                                    */
                            }

                        }

                    }).fail(function (e) {
                        log.error("InteractiveDownload.export; ", e);
                        amplify.publish(E.WAITING_HIDE);
                        amplify.publish(E.NOTIFICATION_WARNING, {title: i18nLabels.error_export});
                    });

                }catch(e) {
                    log.error("InteractiveDownload.export; ", e);
                    amplify.publish(E.WAITING_HIDE);
                }

            };

            InteractiveDownload.prototype.exportTable = function (d, requestObj, options) {

                log.info(" InteractiveDownload.exportTable size:", d);

                var rowsNumber = d.data[0].NoRecords,
                    querySizeCheck = rowsNumber <= this.o.TABLE.MAX_ROWS;

                // analytics
                this.analyticsTableDownload({
                    querySizeCheck: querySizeCheck,
                    querySize: rowsNumber
                });

                // check if data size is right
                if(querySizeCheck) {

                    log.info('InteractiveDownload.exportTable; ', requestObj);

                    amplify.publish(E.EXPORT_DATA,
                        requestObj,
                        { waitingText: 'Please wait<br> The download could require some time', options: options }
                    );

                }
                else {
                    this.suggestBulkDownloadsOrTable();
                }


            };

            InteractiveDownload.prototype.exportPivot = function (d, requestObj, options) {

                amplify.publish(E.WAITING_HIDE);

                if (this.checkIfPivotRendered()) {
                    // TODO: check if PivotAlready rendered and export the pivot
                    var pivotExporter = new PivotExporter({
                        container: this.$OUTPUT_CONTENT,
                        // TODO: consistent filename
                        filename: 'FAOSTAT'
                    });

                    log.info('exportPivot.options', options);

                    (options.file == "csv") ? pivotExporter.csv() : pivotExporter.xls();

                    if(this.checkDataSize(d)) {
                        this.analyticsPivotDownload({
                            querySizeCheck: true,
                            querySize: d.data[0].NoRecords
                        });
                    }else{
                        log.warn("InteractiveDownload.exportPivot; Data didn't pass the checkDataSize for analytics:", d);
                    }

                }else{
                    this.previewPivot(d, requestObj, options, true);
                }

            };

        InteractiveDownload.prototype.exportExcel = function (d, requestObj, options) {

            log.info(" InteractiveDownload.exportExcel size:", d);

            var rowsNumber = d.data[0].NoRecords,
                querySizeCheck = rowsNumber <= this.o.TABLE.MAX_ROWS;

            // analytics
            this.analyticsTableDownload({
                querySizeCheck: querySizeCheck,
                querySize: rowsNumber
            });

            // check if data size is right
            if(querySizeCheck) {

                requestObj.file_type = "xls";

                log.info('InteractiveDownload.exportExcel; ', requestObj);

                amplify.publish(E.EXPORT_DATA,
                    requestObj,
                    { waitingText: 'Please wait<br> The download could require some time'}
                );

            }
            else {
                this.suggestBulkDownloadsOrTable();
            }


        };

            InteractiveDownload.prototype.checkIfPivotRendered = function() {

                log.info(this.$OUTPUT_CONTENT.find(s.PIVOT_TABLE).length, this.$OUTPUT_CONTENT.find(s.PIVOT_TABLE));

                return (this.$OUTPUT_CONTENT.find(s.PIVOT_TABLE).length > 0)? true : false;
            };

            InteractiveDownload.prototype.setPopUpRecognizeUser = function (d, requestObj, options) {
                //************ funxiona con windows open **********
                 var w = 350;
                 var h = 150;
                 var left = Number((screen.width/2)-(w/2));
                 var tops = Number((screen.height/2)-(h/2));

                 var focusW = window.open('registration.html?d='+d+'&requestObj='+requestObj+'&options='+options, '_blank', 'toolbar=no, location=no, directories=no, status=no,  scrollbars=no, resizable=no, width='+w+', height='+h+', top='+tops+', left='+left);
                 focusW.focus();

            };

            InteractiveDownload.prototype.getRequestObject = function () {

                // get options and selections
                // get selections
                var selections = this.selectorsManager.getSelections(),
                    options = this.downloadOptions.getSelections(),
                    domain_code = this.o.code,
                    selectionRequest = {};

                // get request for each selection
                _.each(selections, function(s) {
                    selectionRequest = $.extend(true, {}, selectionRequest, s.request);
                });

                log.info('InteractiveDownload.preview; selections', selections);
                log.info('InteractiveDownload.preview; options', options);
                log.info('InteractiveDownload.preview; selectionRequest', selectionRequest);

                return $.extend(true, {},
                    this.o.DEFAULT_REQUEST,
                    {
                        domain_code: domain_code
                    },
                    selectionRequest,
                    options.request
                );


            };

            InteractiveDownload.prototype.suggestBulkDownloads = function () {

                amplify.publish(E.WAITING_HIDE, {});
                amplify.publish(E.NOTIFICATION_WARNING, {
                    title: i18nLabels.selection_too_large,
                    text: i18nLabels.suggest_bulk_downloads,
                });

                /*  var self = this;
                 // TODO: focus on bulk downloads
                 if (this.o.hasOwnProperty('$BULK_DOWNLOADS_PANEL')) {
                 amplify.publish(E.SCROLL_TO_SELECTOR, {
                 container: this.o.$BULK_DOWNLOADS_PANEL,
                 paddingTop: 150
                 });
                 /!*setTimeout(function() {
                 self.o.$BULK_DOWNLOADS_PANEL.removeClass('bounce animated').addClass('bounce animated');
                 }, 2000);*!/
                 }*/

                this.stateOutputInSelection();

            };

            InteractiveDownload.prototype.suggestBulkDownloadsOrTable = function () {

                amplify.publish(E.WAITING_HIDE, {});
                amplify.publish(E.NOTIFICATION_WARNING, {
                    title: i18nLabels.selection_too_large,
                    text: i18nLabels.suggest_bulk_downloads_or_table,
                });

                // TODO: focus on bulk downloads
                this.stateOutputInSelection();

            };

            InteractiveDownload.prototype.selectionChange = function () {

                log.info('InteractiveDownload.selectionChange');


                // this should be
                /*            this.$OUTPUT_CONTENT.empty();

                 // show message
                 this.$OUTPUT_MESSAGE.show();*/

                this.stateOutputInSelection();

            };

            InteractiveDownload.prototype.checkDataSize = function (d) {

                log.info("InteractiveDownload.checkDataSize; ", d);

                if (d.data.length === 0 || d.data[0].NoRecords === undefined || d.data[0].NoRecords <= 0) {
                    amplify.publish(E.WAITING_HIDE);
                    amplify.publish(E.NOTIFICATION_WARNING,
                        {
                            title: i18nLabels.no_data_available_for_current_selection,
                            text: i18nLabels.please_make_another_selection
                        }
                    );
                    return false;
                }

                return true;

            };

            InteractiveDownload.prototype.noDataAvailablePreview = function () {

                // TODO: a common no data available?
                this.$OUTPUT_CONTENT.html('<h2>'+ i18nLabels.no_data_available_for_current_selection +'</h2>');

            };

            /* Analytics */
            InteractiveDownload.prototype.getAnalyticsLabel = function (obj, addSize) {

                var o = {},
                    obj = obj || {};

                o.querySizeCheck = obj.hasOwnProperty("querySizeCheck")? obj.querySizeCheck : true;
                o.code = this.o.code;

                if (addSize === true && obj.hasOwnProperty("querySize")) {
                    o.querySize = obj.querySize;
                }
                log.info('InteractiveDownload.getAnalyticsLabel;', o)

                return o;

            };

            InteractiveDownload.prototype.analyticsTableQuerySize = function (obj) {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend({}, true,
                        A.interactive_download.table_query_size,
                        { label: this.getAnalyticsLabel(obj, true) }
                    )
                );

            };

            InteractiveDownload.prototype.analyticsPivotQuerySize = function (obj) {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend({}, true,
                        A.interactive_download.pivot_query_size,
                        { label: this.getAnalyticsLabel(obj, true) }
                    )
                );

            };

            InteractiveDownload.prototype.analyticsTablePreview = function (obj) {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend({}, true,
                        A.interactive_download.table_preview,
                        { label: this.getAnalyticsLabel(obj) }
                    )
                );

                this.analyticsTableQuerySize(obj);

            };

            InteractiveDownload.prototype.analyticsTableDownload = function (obj) {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend({}, true,
                        A.interactive_download.table_download_csv,
                        { label: this.getAnalyticsLabel(obj) }
                    )
                );

                this.analyticsTableQuerySize(obj);

            };

            InteractiveDownload.prototype.analyticsPivotPreview = function (obj) {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend({}, true,
                        A.interactive_download.pivot_preview,
                        { label: this.getAnalyticsLabel(obj) }
                    )
                );

                this.analyticsPivotQuerySize(obj);

            };

            InteractiveDownload.prototype.analyticsPivotDownload = function (obj) {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend({}, true,
                        A.interactive_download.pivot_download,
                        { label: this.getAnalyticsLabel(obj) }
                    )
                );

                this.analyticsPivotQuerySize(obj);

            };

            InteractiveDownload.prototype.bindEventListeners = function () {

                var self = this;


                $("#typeInstitution").off('change');
                $("#typeInstitution").on('change', function () {

                    var typeInstitution = $("#typeInstitution").val();
                    var otherInstitution = $("#otherInstitution");
                    var visibleFieldType=false;

                    switch (typeInstitution) {
                        case "Other UN Agencies":
                            visibleFieldType=true;
                            break;
                        case "Other International Organizations/Financial Institutions":
                            visibleFieldType=true;
                            break;
                        case "Other":
                            visibleFieldType=true;
                            break;
                    }

                    if (visibleFieldType){
                        otherInstitution.show();;
                    }else{
                        otherInstitution.hide();
                        otherInstitution.val("");
                    }

                });

                $("#FirstTimeRadioYes").off('click');
                $("#FirstTimeRadioYes").on('click', function () {

                    $("#infoSurvey").hide();

                });

                $("#FirstTimeRadioNo").off('click');
                $("#FirstTimeRadioNo").on('click', function () {
                    $("#infoSurvey").show();
                });


                $("#Strongly_Agree03").off('click');
                $("#Strongly_Agree03").on('click', function () {
                    $("#infoSurveyStatisticsTimely").hide();
                });
                $("#Agree03").off('click');
                $("#Agree03").on('click', function () {
                    $("#infoSurveyStatisticsTimely").hide();
                });
                $("#Neutral03").off('click');
                $("#Neutral03").on('click', function () {
                    $("#infoSurveyStatisticsTimely").hide();
                });
                $("#NoOpinion03").off('click');
                $("#NoOpinion03").on('click', function () {
                    $("#infoSurveyStatisticsTimely").hide();
                });

                $("#Disagree03").off('click');
                $("#Disagree03").on('click', function () {
                    $("#infoSurveyStatisticsTimely").show();
                });
                $("#StronglyDisagree03").off('click');
                $("#StronglyDisagree03").on('click', function () {
                    $("#infoSurveyStatisticsTimely").show();
                });




                $("#infoFormSubmit").off('click');
                $("#infoFormSubmit").on('click', function () {


                  //https://docs.google.com/forms/d/e/1FAIpQLSdfqTVuFwSh19Kx8xX1kveoibvNdo7zcvUOyyVTeJADy4HTZQ/formResponse?usp=pp_url&entry.736113539=test01&entry.1105035716=test@test2eu&entry.383138043=Italy&entry.190535668=test&entry.1226833010=Agency+of+the+United+Nations&entry.2069720957=No&entry.632860769=Strongly+Disagree&entry.1733962598=Disagree&entry.1809401444=Neutral&entry.950429869=Agree&entry.433840719=No+opinion&entry.1354653395=test&entry.1883206493=No&submit=submit
                  //  https://docs.google.com/forms/d/e/1FAIpQLSdfqTVuFwSh19Kx8xX1kveoibvNdo7zcvUOyyVTeJADy4HTZQ/viewform?usp=pp_url&entry.736113539=test01&entry.1105035716=test@test2eu&entry.383138043=Italy&entry.190535668=test&entry.1226833010=Agency+of+the+United+Nations&entry.2069720957=Yes&entry.632860769=Strongly+Disagree&entry.1733962598=Disagree&entry.1809401444=Neutral&entry.950429869=Agree&entry.433840719=No+opinion&entry.1354653395=test&entry.1883206493=Yes

//https://medium.com/@dmccoy/how-to-submit-an-html-form-to-google-sheets-without-google-forms-b833952cc175
//https://docs.google.com/forms/d/e/1FAIpQLSf-0PpwDQFgkgLKXi__zMqRiZU_IKklxj2XIkYWNgH5gvFYyg/viewform?
// //usp=pp_url&entry.757740551=test&entry.178422565=test@tin.it
//https://docs.google.com/forms/d/e/1FAIpQLSf-0PpwDQFgkgLKXi__zMqRiZU_IKklxj2XIkYWNgH5gvFYyg/viewform?usp=pp_url&
// //entry.757740551=Max&entry.178422565=max@fao.org&
// //entry.54602129=Italy&entry.1419840395=FAO&
// //entry.1381672935=Agency+of+the+United+Nations&entry.494633034=yes
// //&entry.408928284=Agree&
// //entry.1569403159=Agree&
// entry.1305525230&entry.337478665=Agree&entry.632437274=Agree
// //&entry.740302245=kindlyInsert&entry.696514738=yes



                    var parametersURL ="";
                   // var baseURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdfqTVuFwSh19Kx8xX1kveoibvNdo7zcvUOyyVTeJADy4HTZQ/formResponse?';
                    var baseURL = 'https://docs.google.com/forms/d/e/1FAIpQLSf-0PpwDQFgkgLKXi__zMqRiZU_IKklxj2XIkYWNgH5gvFYyg/formResponse?';
                    var submitRef = '&submit=Submit';
                    var submitURL = '';

                    var userEmail =  $("#email").val();//1105035716 ///178422565
                    var re_email =  $("#re_email").val();//1105035716

                    var userFullName = $("#name").val();//736113539 //newtest=757740551
                    var userCountry =  $("#CountryUser").val();//383138043
                    var userInstitution = $("#institution").val();//190535668
                    var typeInstitution = $("#typeInstitution").val();//1226833010
                    var typeInstitutionGroups =  $("#typeInstitutionGroups").val();//978257441
                    var firstTimeRadio = $("input[name='FirstTime']:checked").val();//2069720957
                    var QualityDim01 = $("input[name='QualityDim01']:checked").val();//632860769
                    var QualityDim02 = $("input[name='QualityDim02']:checked").val();//1733962598
                    var QualityDim03 = $("input[name='QualityDim03']:checked").val();//1809401444
                    var QualityDim04 = $("input[name='QualityDim04']:checked").val();//950429869
                    var QualityDim05 = $("input[name='QualityDim05']:checked").val();//433840719
                    var QualityDim03_Details =  $("#QualityDim03_Details").val();//402861372
                    var suggestions = $("#suggestions").val();//1354653395
                    var reciveInformation =  $("input[name='recive_Information']:checked").val();//213971431
                    var Thank_you = $("input[name='Thank_you']:checked").val();//1883206493

                    var readValue="";
                    parametersURL = parametersURL +  "entry.178422565=" + userEmail + "&"
                    parametersURL = parametersURL +  "entry.757740551=" + userFullName + "&"
                    parametersURL = parametersURL +  "entry.54602129=" + userCountry + "&"
                    parametersURL = parametersURL +  "entry.1419840395=" + userInstitution + "&"
                    parametersURL = parametersURL +  "entry.1381672935=" + typeInstitution + "&"
                    parametersURL = parametersURL +  "entry.978257441=" + typeInstitutionGroups + "&"
                    parametersURL = parametersURL +  "entry.494633034=" + firstTimeRadio + "&"
                    parametersURL = parametersURL +  "entry.408928284=" + QualityDim01 + "&"
                    parametersURL = parametersURL +  "entry.1569403159=" + QualityDim02 + "&"
                    parametersURL = parametersURL +  "entry.1305525230=" + QualityDim03 + "&"
                    parametersURL = parametersURL +  "entry.337478665=" + QualityDim04 + "&"
                    parametersURL = parametersURL +  "entry.632437274=" + QualityDim05 + "&"
                    parametersURL = parametersURL +  "entry.402861372=" + QualityDim03_Details + "&"

                    parametersURL = parametersURL +  "entry.740302245=" + suggestions + "&"
                    parametersURL = parametersURL +  "entry.213971431=" + reciveInformation + "&"
                    parametersURL = parametersURL +  "entry.696514738=" + Thank_you

                    submitURL = baseURL + parametersURL + submitRef;



                    var checkFieldsInModal = InteractiveDownload.prototype.checkFields(userFullName,userEmail,userInstitution,userCountry,typeInstitution,re_email,firstTimeRadio,QualityDim01,QualityDim02,QualityDim03,QualityDim04,QualityDim05,QualityDim03_Details,reciveInformation,Thank_you);
                   // var checkFieldsInModal=true;



                    if (checkFieldsInModal){
                        var readValue = InteractiveDownload.prototype.getCookie('myUserCookie');

                        if (readValue==""){
                               // submitURL="https://docs.google.com/forms/d/e/1FAIpQLSdfqTVuFwSh19Kx8xX1kveoibvNdo7zcvUOyyVTeJADy4HTZQ/formResponse";
                            $.ajax({
                               url: submitURL,
                               // data: {"entry.736113539": userFullName, "entry.1981219848": userEmail ,"entry.383138043": userInstitution, "entry.190535668": userTypeInstitution, "entry.1226833010": userCountry, "entry.1009202517": otherInstitution},
                               // data: {"entry.736113539": userFullName, "entry.1981219848": userEmail ,"entry.383138043": userInstitution, "entry.190535668": typeInstitution, "entry.1226833010": userCountry},
                              /* data: {
                                    "entry.1105035716": userEmail ,
                                    "entry.736113539": userFullName,
                                    "entry.383138043": userCountry,
                                    "entry.190535668": userInstitution,
                                    "entry.1226833010": typeInstitution,
                                    "entry.2069720957": firstTimeRadio,
                                    "entry.632860769": QualityDim01,
                                    "entry.1733962598": QualityDim02,
                                    "entry.1809401444": QualityDim03,
                                    "entry.950429869": QualityDim04,
                                    "entry.433840719": QualityDim05,
                                    "entry.1354653395": suggestions,
                                    "entry.1883206493": Thank_you
                                },*/
                                type: "POST",
                                dataType: "xml",

                                success: function(data) {
                                    alert('success' + data);
                                    /*

                                     self.exportTable(exp_options.d, exp_options.requestObj, exp_options.options);
                                     $("#infoForm_modal").modal('hide');
                                     */
                                },
                                error: function(data) {
                                    console.log('error' , data);
                                },
                                complete: function () {
                                    if (exp_options.typeDownload == "table"){

                                        self.exportTable(exp_options.d, exp_options.requestObj, exp_options.options);
                                    }else if (exp_options.typeDownload == "pivot") {

                                        self.exportPivot(exp_options.d, exp_options.requestObj, exp_options.options);
                                    }

                                    self.showModal();
                                }

                            });

                            InteractiveDownload.prototype.setCookie('myUserCookie', userEmail, 1, '/');
                        }

                    }





                });



                this.$PREVIEW_BUTTON.off('click');
                this.$PREVIEW_BUTTON.on('click', function () {
                    self.preview();
                });

                this.$EXPORT_BUTTON.off('click');
                this.$EXPORT_BUTTON.on('click', function () {
                    self.export();
                });

                this.$OUTPUT_EXPORT.on('click', function () {

                    // TODO: check if there is a better way to check if the button is disabled
                    if(!$(this).hasClass('disabled')) {
                        self.export();
                    }

                });

                amplify.subscribe(E.DOWNLOAD_SELECTION_CHANGE, this, this.selectionChange);

            };

            InteractiveDownload.prototype.unbindEventListeners = function () {

                this.$PREVIEW_BUTTON.off('click');
                this.$EXPORT_BUTTON.off('click');
                this.$OUTPUT_EXPORT.off('click');

                amplify.unsubscribe(E.DOWNLOAD_SELECTION_CHANGE, this.selectionChange);
            };

            InteractiveDownload.prototype.destroySelectorManager = function () {

                if (this.selectorsManager && _.isFunction(this.selectorsManager.destroy)) {
                    this.selectorsManager.destroy();
                }

            };

            InteractiveDownload.prototype.stateOutputInPreview = function () {

                // TODO: check if it works in all situations
                this.$OUTPUT_MESSAGE.hide();

                // this.$OUTPUT_EXPORT.enable();
                // TODO: find a nicer way to enable/disable the export button
                this.$OUTPUT_EXPORT.removeClass('disabled');
                this.$OUTPUT_EXPORT.addClass('enabled');

            };

            InteractiveDownload.prototype.stateOutputInSelection = function () {

                // TODO: check if it works in all situations
                this.$OUTPUT_CONTENT.empty();

                this.$OUTPUT_MESSAGE.show();

                // this.$OUTPUT_EXPORT.enable();
                // TODO: find a nicer way to enable/disable the export button
                this.$OUTPUT_EXPORT.removeClass('enabled');
                this.$OUTPUT_EXPORT.addClass('disabled');

            };

            InteractiveDownload.prototype.destroy = function () {

                log.info('InteractiveDownload.destroy;');

                this.unbindEventListeners();

                this.destroySelectorManager();

                this.$CONTAINER.empty();

            };

            InteractiveDownload.prototype.checkFields = function (userFullName, userEmail, userInstitution, userCountry, typeInstitution, re_email, firstTimeRadio ,QualityDim01, QualityDim02, QualityDim03, QualityDim04, QualityDim05, Quality_Details, reciveInformation, Thank_you) {
                var errModal="";
                var checkFirstTime=false;



                if (QualityDim03 !== undefined) {
                     if ((QualityDim03.trim() == 'Disagree')){
                         if (Quality_Details === undefined) {
                             errModal = errModal + "- Kindly provide details regarding the timeliness\n";
                         }else{
                             if (Quality_Details.trim() == "") {
                                 errModal = errModal + "- Kindly provide details regarding the timeliness\n";
                             }
                         }
                     }

                    if ((QualityDim03.trim() == 'Strongly Disagree')){
                        if (Quality_Details === undefined) {
                            errModal = errModal + "- Kindly provide details regarding the timeliness\n";
                        }else{
                            if (Quality_Details.trim() == "") {
                                errModal = errModal + "- Kindly provide details regarding the timeliness\n";
                            }
                        }
                    }
                }


                if (userFullName.trim() == "") {
                    errModal = errModal + "- Full Name\n";
                }
               /* if ((visibleFieldType)&& (otherInstitution.trim() == "")) {
                    errModal = errModal + "Other Institution\n";
                }*/
                if (userCountry.trim() == "") {
                    errModal = errModal + "- Country\n";
                }

                if (typeInstitution.trim() == "") {
                    errModal = errModal + "- User group\n";
                }

                if (userEmail.trim() == "") {
                    errModal = errModal + "- Email Address\n";
                }else{
                    if (!InteractiveDownload.prototype.checkEmail(userEmail.trim())) {
                        errModal = errModal + "- Incorrect Email Address\n";
                    }else{
                        if ((userEmail.trim())!=(re_email.trim())) {
                            errModal = errModal + "- Incorrect Email Address\n";
                        }
                    }
                }
                if (firstTimeRadio == "no"){
                    if (QualityDim01 === undefined) {
                        checkFirstTime=true;
                    }
                    if (QualityDim02 === undefined) {
                        checkFirstTime=true;
                    }
                    if (QualityDim03 === undefined) {
                        checkFirstTime=true;
                    }
                    if (QualityDim04 === undefined) {
                        checkFirstTime=true;
                    }
                    if (QualityDim05 === undefined) {
                        checkFirstTime=true;
                    }
                }

                if (reciveInformation === undefined) {
                    errModal = errModal + "- Would you like receive information regarding FAOSTAT updates via email\n";
                }
                if (Thank_you === undefined) {
                    errModal = errModal + "- Would you be willing to fill out a slightly longer questionnaire ... \n";
                }

                if (checkFirstTime) {
                    errModal = errModal + "please select at least one item of Quality Dimension\n"
                }


                if (userInstitution.trim() == "") {
                    errModal = errModal + "Institution\n";
                }

                if (errModal==""){
                    return true;
                }else{
                    alert("Fields required:\n\n" + errModal + "\n")
                    return false;
                }
            }

        InteractiveDownload.prototype.getCookie = function (nome) {
            var name = nome + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }

        InteractiveDownload.prototype.setCookie = function(nome, valore, ggScadenza, path) {
            if (path == undefined) {
                path = "/";
            }
            var d = new Date();
            d.setTime(d.getTime() + (ggScadenza * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = nome + "=" + valore + "; " + expires + "; path=" + path;
        }


            InteractiveDownload.prototype.showModal = function () {

                amplify.publish(E.WAITING_HIDE);
                $("#infoForm_modal").modal('toggle');
                $("#infoForm_modal_contentBody").toggle();
            }


            return InteractiveDownload;
    });