/*global define, numeral, amplify*/
define(['jquery',
        'loglevel',
        'config/Events',
        'handlebars',
        'text!faostat_ui_table/html/templates.hbs',
        'faostatapiclient',
        'underscore',
        'bootstrap',
        'amplify',
        'numeral'], function ($, log, E, Handlebars, templates, FAOSTATAPI, _) {

    'use strict';

    function TABLE() {

        this.CONFIG = {
            //placeholder_id: 'faostat_ui_table',
            data: null,
            metadata: null,
            show_codes: true,
            show_units: true,
            show_flags: true,
            decimal_places: 2,
            decimal_separator: '.',
            thousand_separator: ',',
            page_size: 25,
            current_page: 1,
            onPageClick: function () {
                /* Restore the "config" argument of the function. */
            }

        };

    }

    TABLE.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        log.info("TABLE.init; config", this.CONFIG);

        this.api = new FAOSTATAPI();

        this.request = $.extend(true, {}, config.request);

        this.prepare_data(this.CONFIG.current_page);

    };

    TABLE.prototype.prepare_data = function(page, page_size) {

        var self = this;

        this.request.page_number = page;
        this.request.page_size = (page_size)? page_size : this.CONFIG.page_size;

        amplify.publish(E.WAITING_SHOW);

        this.api.databean(this.request).then(function(d) {

            amplify.publish(E.WAITING_HIDE);

            log.info('TABLE.init; data:', d);

            self.CONFIG.data = d.data;
            self.CONFIG.metadata = d.metadata;

            /* Sort metadata. */
            self.CONFIG.metadata.dsd = _.sortBy(self.CONFIG.metadata.dsd, function (o) {
                return parseInt(o.index, 10);
            });

            /* Render. */
            self.render();

        });

    };

    TABLE.prototype.render = function () {

        log.info('TABLE.render;');

        /* Variables. */
        var source,
            template,
            dynamic_data,
            html,
            rows = [],
            headers = [],
            row,
            i,
            j,
            formatter = '',
            pages_number,
            that = this;

        /* Prepare the value formatter. */
        numeral.language('faostat', {
            delimiters: {
                thousands: this.CONFIG.thousand_separator,
                decimal: this.CONFIG.decimal_separator
            }
        });

        console.log(this.CONFIG.thousand_separator);

        numeral.language('faostat');
        formatter = '0' + this.CONFIG.thousand_separator + '0' + this.CONFIG.decimal_separator;
        for (i = 0; i < this.CONFIG.decimal_places; i += 1) {
            formatter += '0';
        }

        /* Process headers. */
        for (j = 0; j < this.CONFIG.metadata.dsd.length; j += 1) {
            if (this.CONFIG.metadata.dsd[j].type === 'code') {
                headers.push({
                    label: this.CONFIG.metadata.dsd[j].label,
                    type: this.CONFIG.metadata.dsd[j].type,
                    show: this.CONFIG.show_codes
                });
            } else if (this.CONFIG.metadata.dsd[j].type === 'flag') {
                headers.push({
                    label: this.CONFIG.metadata.dsd[j].label,
                    type: this.CONFIG.metadata.dsd[j].type,
                    show: this.CONFIG.show_flags
                });
            } else if (this.CONFIG.metadata.dsd[j].type === 'flag_label') {
                headers.push({
                    label: this.CONFIG.metadata.dsd[j].label,
                    type: this.CONFIG.metadata.dsd[j].type,
                    show: this.CONFIG.show_flags
                });

            } else if (this.CONFIG.metadata.dsd[j].type === 'unit') {
                headers.push({
                    label: this.CONFIG.metadata.dsd[j].label,
                    type: this.CONFIG.metadata.dsd[j].type,
                    show: this.CONFIG.show_units
                });
            } else {
                headers.push({
                    label: this.CONFIG.metadata.dsd[j].label,
                    type: this.CONFIG.metadata.dsd[j].type,
                    show: true
                });
            }
        }

        /* Process data. */
        for (i = 0; i < this.CONFIG.data.length; i += 1) {
            row = {};
            row.cells = [];
            for (j = 0; j < this.CONFIG.metadata.dsd.length; j += 1) {
                if (this.CONFIG.metadata.dsd[j].type === 'value') {
                    if (this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key] === undefined) {
                        row.cells.push({
                            label: undefined,
                            type: this.CONFIG.metadata.dsd[j].type,
                            show: true
                        });
                    } else {
                        row.cells.push({
                            label: numeral(this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key]).format(formatter),
                            type: this.CONFIG.metadata.dsd[j].type,
                            show: true
                        });
                    }
                } else if (this.CONFIG.metadata.dsd[j].type === 'code') {
                    row.cells.push({
                        label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                        type: this.CONFIG.metadata.dsd[j].type,
                        show: this.CONFIG.show_codes
                    });

                } else if (this.CONFIG.metadata.dsd[j].type === 'unit') {
                    row.cells.push({
                        label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                        type: this.CONFIG.metadata.dsd[j].type,
                        show: this.CONFIG.show_units
                    });

                } else if (this.CONFIG.metadata.dsd[j].type === 'flag') {
                    row.cells.push({
                        label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                        type: this.CONFIG.metadata.dsd[j].type,
                        show: this.CONFIG.show_flags
                    });

                } else if (this.CONFIG.metadata.dsd[j].type === 'flag_label') {
                    row.cells.push({
                        label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                        type: this.CONFIG.metadata.dsd[j].type,
                        show: this.CONFIG.show_flags
                    });

                } else {
                    row.cells.push({
                        label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                        type: this.CONFIG.metadata.dsd[j].type,
                        show: true
                    });
                }
            }
            rows.push(row);
        }

        //log.info('TABLE.render; rows', rows)

        /* Create pager. */
        this.CONFIG.total_pages = Math.ceil(parseFloat(this.CONFIG.total_rows) / parseFloat(this.CONFIG.page_size))


        /* Load main structure. */
        source = $(templates).filter('#faostat_ui_table_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            headers: headers,
            rows: rows,
            current_page: this.CONFIG.current_page,
            total_pages: this.CONFIG.total_pages
        };
        html = template(dynamic_data);

        if (this.CONFIG.hasOwnProperty('container')) {
            this.$CONTAINER = $(this.CONFIG.container);
        }else {
            this.$CONTAINER = $('#' + this.CONFIG.placeholder_id);
        }

        this.$CONTAINER.html(html);

        /* Add click listener. */
        this.$CONTAINER.find('.next_page_button').off().click(function () {
            that.CONFIG.current_page += 1;
            if (that.CONFIG.current_page > that.CONFIG.total_pages) {
                that.CONFIG.current_page = that.CONFIG.total_pages;
            }
            that.onPageClick();
        });
        this.$CONTAINER.find('.previous_page_button').off().click(function () {
            that.CONFIG.current_page -= 1;
            if (that.CONFIG.current_page < 1) {
                that.CONFIG.current_page = 1;
            }
            that.onPageClick();
        });
        this.$CONTAINER.find('.first_page_button').off().click(function () {
            that.CONFIG.current_page = 1;
            that.onPageClick();
        });
        this.$CONTAINER.find('.last_page_button').off().click(function () {
            that.CONFIG.current_page = that.CONFIG.total_pages;
            that.onPageClick();
        });

    };

    TABLE.prototype.onPageClick = function () {
        var that = this;
        log.info('TABLE.onPageClick;', that.CONFIG.current_page, that.CONFIG.total_pages);

        this.prepare_data(that.CONFIG.current_page);
    };

    TABLE.prototype.dispose = function () {
        $('.next_page_button').off();
        $('.last_page_button').off();
        $('.first_page_button').off();
        $('.previous_page_button').off();
    };

    return TABLE;
});