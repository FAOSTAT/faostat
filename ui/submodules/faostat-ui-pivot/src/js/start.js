/*global define, setInterval, clearInterval, numeral*/
define(['jquery',
        'loglevel',
        'handlebars',
        'text!faostat_ui_pivot/html/templates.hbs',
        'underscore',
        'underscore.string',
        'bootstrap',
        'numeral',
        'amplify',
        'jbPivot'], function ($, log, Handlebars, templates, _, _s) {

    'use strict';

    function PIVOT() {

        this.CONFIG = {

            lang: 'E',
            prefix: 'faostat_ui_pivot_',
            placeholder_id: 'faostat_ui_pivot',
            data: null,
            dsd: null,
            label2code_map: null,
            show_flags: true,
            show_codes: true,
            show_units: true,
            render: true,

            decimal_places: 6,
            decimal_separator: '.',
            thousand_separator: ','

        };

    }

    PIVOT.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Render. */
        this.render();

    };

    PIVOT.prototype.render = function () {

        log.info('Pivot.start; render');

        /* Variables. */
        var source,
            template,
            dynamic_data,
            html,
            that = this,
            i,
            fields = {},
            yfields = [],
            xfields = [],
            zfields = [],
            interval,
            key,
            lbl,
            selector,
            thousands = this.CONFIG.thousand_separator,
            decimal = this.CONFIG.decimal_separator,
            decimal_places =  this.CONFIG.decimal_places


        /* Map codes. */
        this.map_codes();

        //log.info('Pivot.start; map_codes_ended');

        // Prepare the value formatter.
        numeral.language('pivot', {
            delimiters: {
                thousands: thousands,
                decimal: decimal
            }
        });
        this.CONFIG.formatter = '0' + thousands + '0' + decimal;

        numeral.language('pivot');

        this.CONFIG.formatter += '[';
        for (var i = 0; i < decimal_places; i += 1) {
            this.CONFIG.formatter += '0';
        }
        this.CONFIG.formatter += ']';

        /* Load main structure. */
        source = $(templates).filter('#faostat_ui_pivot_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            render: this.CONFIG.render
        };
        html = template(dynamic_data);

        // switch
        if (this.CONFIG.hasOwnProperty('container')) {
            this.$CONTAINER = $(this.CONFIG.container);
        }
        else if (this.CONFIG.hasOwnProperty('placeholder_id')) {
            this.$CONTAINER = $('#' + this.CONFIG.placeholder_id);
        }
        this.$CONTAINER.html(html);


        log.info('Pivot.start; rendered template');


        /* Configure the pivot according to the DB settings. */
        for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
            log.info('Pivot.start; dsd', i, this.CONFIG.dsd[i]);
            switch (this.CONFIG.dsd[i].type) {
            case 'code':
                break;
            case 'flag':
                break;
            case 'value':
                log.info('Pivot.start; ', this.CONFIG.dsd[i].label);
                fields[this.CONFIG.dsd[i].label] = {
                    field: this.CONFIG.dsd[i].label,
                    sort: 'asc',
                    showAll: true,
                    aggregateType: 'average',
                    groupType: 'none',
                    formatter: _.bind(this.pivot_value_formatter, this)
                };
                break;
            case 'flag_label':
                fields[this.CONFIG.dsd[i].label] = {
                    field: this.CONFIG.dsd[i].label,
                    sort: 'asc',
                    showAll: true,
                    aggregateType: 'distinct',
                    formatter: this.pivot_flag_formatter
                };
                break;
            default:
                fields[this.CONFIG.dsd[i].label] = {
                    field: this.CONFIG.dsd[i].label,
                    sort: 'asc',
                    showAll: true,
                    aggregateType: 'distinct'
                };
                break;
            }
            if (this.CONFIG.dsd[i].type !== 'code' && this.CONFIG.dsd[i].type !== 'flag') {
                switch (this.CONFIG.dsd[i].pivot) {
                case 'C':
                    yfields.push(this.CONFIG.dsd[i].label);
                    break;
                case 'R':
                    xfields.push(this.CONFIG.dsd[i].label);
                    break;
                case 'V':
                    if (this.CONFIG.dsd[i].type === 'flag_label') {
                        if (this.CONFIG.show_flags) {
                            zfields.push(this.CONFIG.dsd[i].label);
                        }
                    } else if (this.CONFIG.dsd[i].type === 'unit') {
                        if (this.CONFIG.show_units) {
                            zfields.push(this.CONFIG.dsd[i].label);
                        }
                    } else {
                        zfields.push(this.CONFIG.dsd[i].label);
                    }
                    break;
                }
            }
        }

        /* Add codes in the table, if required. */
        if (this.CONFIG.show_codes) {
            this.add_codes();
        }

        log.info("label2code_map", this.CONFIG.label2code_map);
        log.info("data", this.CONFIG.data);
        log.info("fields", fields);
        log.info("yfields", yfields);
        log.info("xfields", xfields);
        log.info("zfields", zfields);

        /* Render pivot table. */
        $('#pivot_placeholder').jbPivot({
            fields: fields,
            yfields: yfields,
            xfields: xfields,
            zfields: zfields,
            data: this.CONFIG.data,
            copyright: false,
            summary: false,
            label2code_map: this.CONFIG.label2code_map
        });

        /* Add flag codes, if required. */
        if (this.CONFIG.show_codes) {
            interval = setInterval(function () {
                html = $('#pivot_placeholder').html();
                if (html !== undefined) {
                    clearInterval(interval);
                    if (that.CONFIG.show_codes) {
                        for (i = 0; i < Object.keys(that.CONFIG.label2code_map).length; i += 1) {
                            key = Object.keys(that.CONFIG.label2code_map)[i].toString().replace(/\s/g, '_').replace(/,/g, '').replace(/\(|\)/g, '').replace(/'/g, '');
                            selector = $('.' + key);
                            if (selector !== undefined) {
                                lbl = that.CONFIG.label2code_map[key];
                                // trimming the flag codes because they are two digits.
                                // TODO: this should be already performed in the DB.
                                lbl = _s.trim(lbl);
                                if (lbl.length > 0) {
                                    selector.html(' [' + lbl + ']');
                                }
                            }
                        }
                    }
                }
            }, 500);
        }

    };

    PIVOT.prototype.add_codes = function () {
        log.info('Pivot.start; add_codes');
        var label_indices = this.get_label_columns(),
            i,
            j,
            label,
            code;
        for (i = 0; i < this.CONFIG.data.length; i += 1) {
            for (j = 0; j < label_indices.length; j += 1) {
                label = this.CONFIG.data[i][label_indices[j]];
                code = this.CONFIG.label2code_map[label.replace(/\s/g, '_').replace(/,/g, '').replace(/\(|\)/g, '').replace(/'/g, '')];
                if (code !== undefined) {
                    this.CONFIG.data[i][label_indices[j]] = label + ' [' + code + ']';
                }
            }
        }
    };

    PIVOT.prototype.get_label_columns = function () {
        log.info('Pivot.start; get_label_columns');
        var out = [], i;
        for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
            if (this.CONFIG.dsd[i].type === 'label') {
                out.push(this.CONFIG.dsd[i].key);
            }
        }
        return out;
    };

    PIVOT.prototype.pivot_value_formatter = function (V) {
        var res = null;
        // TODO: this should be performed on the DSD model?
        if (typeof V === 'number') {
            //log.info(V);
            //res = V.toFixed(2);
            //log.info(this.CONFIG, this.CONFIG.formatter);
            res = numeral(parseFloat(V)).format(this.CONFIG.formatter);
        }
        return res;
    };

    PIVOT.prototype.pivot_flag_formatter = function (V) {
        try {
            return V + '<span class="' + V.toString().replace(/\s/g, '_').replace(/,/g, '').replace(/\(|\)/g, '').replace(/'/g, '') + '"></span>';
        } catch (e) {
            return V;
        }
    };

    PIVOT.prototype.map_codes = function () {

        /* Variables. */
        var map = {},
            i,
            j,
            code_label_map = {},
            header_codelabel_map = {},
            code_idx,
            label_idx;

        /* Map the dimension id with the table indices. */
        try {
            for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
                if (this.CONFIG.dsd[i].dimension_id !== undefined) {
                    if (this.CONFIG.dsd[i].type === 'code' || this.CONFIG.dsd[i].type === 'flag') {
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id] === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id] = {};
                        }
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id].code === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id].code = this.CONFIG.dsd[i].key;
                        }
                    }
                    if (this.CONFIG.dsd[i].type === 'label' || this.CONFIG.dsd[i].type === 'flag_label') {
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id] === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id] = {};
                        }
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id].label === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id].label = this.CONFIG.dsd[i].key;
                        }
                    }
                }
            }
        } catch (ignore) {

        }

        /* Map the column header with the table indices. */
        for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
            if (this.CONFIG.dsd[i].dimension_id !== undefined) {
                if (this.CONFIG.dsd[i].type === 'label' || this.CONFIG.dsd[i].type === 'flag_label') {
                    header_codelabel_map[this.CONFIG.dsd[i].label] = {
                        code: code_label_map[this.CONFIG.dsd[i].dimension_id].code,
                        label: code_label_map[this.CONFIG.dsd[i].dimension_id].label
                    };
                }
            }
        }

        /* Create a map between labels and codes. */
        for (i = 0; i < this.CONFIG.data.length; i += 1) {
            for (j = 0; j < Object.keys(header_codelabel_map).length; j += 1) {
                code_idx = header_codelabel_map[Object.keys(header_codelabel_map)[j]].code;
                label_idx = header_codelabel_map[Object.keys(header_codelabel_map)[j]].label;
                // TODO: should be a test on string?
                //log.info('Pivot.start; this.CONFIG.data[i][label_idx], this.CONFIG.data[i][code_idx]);
                if (this.CONFIG.data[i][label_idx] !== undefined && this.CONFIG.data[i][label_idx] !== null) {
                    map[this.CONFIG.data[i][label_idx].replace(/\s/g, '_').replace(/,/g, '').replace(/\(|\)/g, '').replace(/'/g, '')] = this.CONFIG.data[i][code_idx];
                }else{
                    log.warn('TODO: something here? ', this.CONFIG.data[i][label_idx], this.CONFIG.data[i][code_idx]);
                }
            }
        }

        /* Store the map. */
        this.CONFIG.label2code_map = map;

    };

    PIVOT.prototype.dispose = function () {
        this.$CONTAINER().empty();
    };

    return PIVOT;

});