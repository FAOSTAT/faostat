/*global define*/
define(['jquery',
        'loglevel',
        'handlebars',
        'config/Config',
        'globals/Common',
        'text!faostat_ui_bulk_downloads/html/templates.hbs',
        'faostatapiclient',
        'i18n!faostat_ui_bulk_downloads/nls/translate'
        ], function ($, log, Handlebars, C, Common, templates, API, translate) {

    'use strict';

    var s = {

        BULK_DOWNLOADS: '#bulk-download-items',
        GO_TO_SECTION: '#go-to-section'

    }, defaultOptions = {

        bulk_downloads_root: C.URL_BULK_DOWNLOADS_BASEPATH,
        show_header: true,
        show_all_data_only: false

    };

    function BULK() {

        log.info('Bulk');

    }

    BULK.prototype.init = function (config) {

        this.o = $.extend(true, {}, defaultOptions, config);

        log.info("BULK.init; options", this.o);

        /* Container */
        this.$CONTAINER = $(this.o.container);
        this.$CONTAINER.html('daje');

        /* init variables */
        this.$CONTAINER.html($(templates).filter('#template').html());

        this.$BULK_DOWNLOADS = this.$CONTAINER.find(s.BULK_DOWNLOADS);

        this.createBulkDownloadList();

    };

    BULK.prototype.createBulkDownloadList = function () {

        log.info('BULK.createBulkDownloadList;');

        /* this... */
        var that = this,
            i,
            name,
            size,
            sizeUnit = 'MB';

        /* Fetch available bulk downloads. */
        API.bulkdownloads({
            domain_code: this.o.code
        }).then(function (json) {

            /* prepare json */
            var bulk_downloads_list = [],
                source = $(templates).filter('#dropdown_items').html(),
                t = Handlebars.compile(source);

            for (i = 0; i < json.data.length; i += 1) {
                name = json.data[i].FileContent.replace(/\_/g, ' ');
                name = name.substring(0, name.indexOf('('));
                size = json.data[i].FileContent.substring(1 + json.data[i].FileContent.lastIndexOf('('), json.data[i].FileContent.length - 1);
                if (json.data[i].FileContent.indexOf('(Norm)') > -1) {
                    name += ' (Norm)';
                }

                // TODO: add a check
                // conversion from KB to MB
                size = (parseFloat(size.substring(0, size.indexOf(' ')).replace(',', '').replace('.', '')) * 0.001).toFixed(2);

                bulk_downloads_list.push( {
                    item_url: that.o.bulk_downloads_root + json.data[i].FileName,
                    item_text: name,
                    item_size: size + ' ' + sizeUnit
                });
            }

            log.info('BULk; bulk_downloads_list', bulk_downloads_list);

            if (bulk_downloads_list.length <= 0) {
                bulk_downloads_list = null;
            }

            that.$BULK_DOWNLOADS.html(t({
                bulk_downloads_list: bulk_downloads_list,
                no_bulk_downlaod_available: translate.no_bulk_downlaod_available,
                bulk_downloads: translate.bulk_downloads,
                bulk_downloads_welcome: translate.bulk_downloads_welcome
            }));

        });

    };

    BULK.prototype._showList = function() {

    };

    BULK.prototype._showAllDataButton = function() {

    };

    BULK.prototype.dispose = function () {

        this.$CONTAINER.empty();

    };

    return BULK;

});