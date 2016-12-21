/* global define, console, amplify */
define([
        'jquery',
        'loglevel',
        'config/Events',
        'underscore',
        'handlebars',
        'text!fs-r-t/html/templates/base_template.hbs',
        'i18n!nls/download',
        'faostatapiclient',
        'datatables.net-bs',
        'datatables-fixedcolumns',
        //'datatables-responsive',
        //'datatables-fixedheader',
        //'datatables-colreorder',
        //'datatables.net-buttons-bs',
        'amplify'
    ],
    function ($, log, E, _, Handlebars, template, i18nLabels, API) {

        'use strict';

        var REQUEST = {

            },
            defaultOptions = {

            };

        function ReportTable() {

            return this;
        }

        ReportTable.prototype.init = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            this.$CONTAINER = $(this.o.container);

        };

        ReportTable.prototype.export = function(config) {

            this.o = $.extend(true, {}, this.o, config);

            var self = this,
                type = this.o.type || 'xls',
                request = $.extend(true, {},
                    REQUEST,
                    this.o.request,
                    { report_code: this.o.request.domain_code }
                );

            amplify.publish(E.WAITING_SHOW);

            // TODO refactor code
            // TODO check if the table is already rendered and export without make a new request
            API.reportheaders(request).then(function(h) {

                API.reportdata(request).then(function(d) {

                    amplify.publish(E.WAITING_HIDE);

                    self._processData(h, d, false);

                    amplify.publish(E.EXPORT_TABLE_HTML, {
                        container: self.$CONTAINER,
                        //container: "#test",
                        type: type
                    });

                }).fail(function() {
                    amplify.publish(E.WAITING_HIDE);
                })
            }).fail(function() {
                amplify.publish(E.WAITING_HIDE);
            })

        };

        ReportTable.prototype.render = function() {

            var self = this,
                request = $.extend(true, {}, REQUEST, this.o.request, {
                    report_code: this.o.request.domain_code
                });

            amplify.publish(E.WAITING_SHOW);

            // TODO refactor code
            API.reportheaders(request).then(function(h) {

                API.reportdata(request).then(function(d) {

                    amplify.publish(E.WAITING_HIDE);

                    amplify.publish(E.SCROLL_TO_SELECTOR, {container: self.$CONTAINER});

                    if (d.data.length > 0) {

                        self._processData(h, d, true);

                    }else {

                        self.noDataAvailable();

                    }

                }).fail(function() {
                    amplify.publish(E.WAITING_HIDE);
                })
            }).fail(function() {
                amplify.publish(E.WAITING_HIDE);
            })

        };

        ReportTable.prototype.noDataAvailable = function () {

            this.$CONTAINER.html('<h1>' + i18nLabels.no_data_available_for_current_selection +'</h1>');

        };

        ReportTable.prototype._processData = function (h, d, render) {

            var headerRows = this._processHeaderRows(h.data),
                columnsNumber = this._getColumnsNumber(headerRows[1]),
                dataRows = this._processDataRows(d.data, columnsNumber),
                t = Handlebars.compile(template),
                display = (render === false)? 'none': null,
                id = 'table-' + Math.random().toString().replace('.', '');

            this.$CONTAINER.html(t({
                header: headerRows,
                rows: dataRows,
                display: display,
                id: id
            }));

            var table = this.$CONTAINER.find('#' + id).DataTable({
                scrollY:        "450px",
                //scrollY:        '50vh',
                scrollX:        true,
                scrollCollapse: true,
                paging:         false,
                //responsive: true,
                searching: true,
                ordering: true,
                info:     false,
                colReorder: true,
                //fixedHeader: true,
                aaSorting: [],
                columnDefs: [
                    //{ width: '20%', targets: 0 }
                ],
                language: {
                    search: "Search"
                },
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'excel', 'pdf'
                ]

/*                dom: 'Bfrtip',
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],*/
               /* fixedColumns: {
                    leftColumns: 1
                }*/
            });

        };

        ReportTable.prototype._processHeaderRows = function (d) {

            var r = {};

            _.each(d, function(v, index) {
                if (!r.hasOwnProperty(v.RowNo)) {
                    r[v.RowNo] = [];
                }

                v["text-align"] = (v.RowNo === 1) ? null : 'center';

                r[v.RowNo].push(v);
            });

            return r;

        };

        ReportTable.prototype._getColumnsNumber = function (r) {

            var t = 0;

            _.each(r, function(d) {
                t = t + d.ColSpan;
            });

            return t;

        };

        ReportTable.prototype._processDataRows = function (d, columnsNumber) {

            var rows = [],
                i;

            _.each(d, function(v) {

                var data = [];

                // reconstruct row
                for(i = 1; i < (columnsNumber + 1); i += 1) {

                    if (v.hasOwnProperty('Col' + i)) {
                        data.push({
                            'text-align': (i === 1)? null: 'right',
                            label: v['Col' + i]
                        });
                    }else {
                        data.push('');
                    }
                }

                // add row
                rows.push({
                    data: data,
                    rowShade: v.RowShade
                });

            });

            return rows;

        };

        ReportTable.prototype.onError = function () {

        };

        ReportTable.prototype.destroy = function () {
            // TODO: proper destroy
        };

        return ReportTable;
    });