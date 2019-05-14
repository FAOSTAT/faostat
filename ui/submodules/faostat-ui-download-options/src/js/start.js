/*global define*/
define(['jquery',
        'loglevel',
        'config/Events',
        'handlebars',
        'text!fs-d-o/html/templates.hbs',
        'i18n!fs-d-o/nls/translate',
        'bootstrap',
        'amplify'], function ($, log, E, Handlebars, templates, translate) {

    'use strict';

    // TODO: to be refactored.
    function OPTIONS() {

        this.CONFIG = {

            mode: 'window',

            container: 'placeholder',
            user_selection: {},
            prefix: Math.random().toString().replace('.', ''),

            excel_button: true,
            metadata_button: false,
            pdf_button: true,
            ok_button: false,
            csv_button: true,

            decimal_separators: true,
            thousand_separators: true,
            decimal_numbers: false,
            show_options: true,
            output_type: true,
            file_type: true,
            show_export_type: true,


            pdf_button_id: 'pdf_button_id',
            csv_button_id: 'csv_button_id',
            excel_button_id: 'excel_button_id',
            metadata_button_id: 'metadata_button_id',
            decimal_separator_id: 'decimal_separator',
            thousand_separator_id: 'thousand_separator',
            decimal_numbers_id: 'decimal_numbers',
            flags_id: 'flags',
            codes_id: 'codes',
            units_id: 'units',
            null_values_id: 'null_values',

            button_label: translate.download_as,
            header_label: translate.button,

            decimal_numbers_value: 2,
            decimal_separator_value: '.',
            thousand_separator_value: '',
            flags_value: true,
            codes_value: true,
            units_value: true,
            null_values_value: false,

            table_value: true,
            pivot_value: false,

            excel_value: false,
            type_csv_value: true,

            callback: {
                onDecimalSeparatorChange: null,
                onDecimalNumbersChange: null,
                onCodesChange: null,
                onNullValuesChange: null,
                onFlagsChange: null,
                onOutputTypeChange: null,
                onFileTypeChange: null,
                onUnitsChange: null
            }

        };

    }

    OPTIONS.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

    };

    OPTIONS.prototype.apply_configuration = function () {

        /* Variables. */
        var that = this,
            partial_source,
            source,
            template,
            dynamic_data,
            html;

        /* Render template according to the mode: window (default) or panel. */
        if (this.CONFIG.mode === 'window') {

            /* Register Handlebars's partial. */
            partial_source = $(templates).filter('#options_panel').html();
            Handlebars.registerPartial('options_panel', partial_source);

            /* Load button template. */
            source = $(templates).filter('#modal_window_button').html();
            template = Handlebars.compile(source);

        } else if (this.CONFIG.mode === 'panel') {

            /* Load panel template. */
            source = $(templates).filter('#options_panel').html();
            template = Handlebars.compile(source);

        }

        /* Inject values in the placeholders. */
        dynamic_data = {
            ok_button_label: 'OK',
            pdf_label: translate.pdf,
            csv_label: translate.csv,
            metadata_label: translate.metadata,
            ok: this.CONFIG.ok_button,
            show_label: translate.show,
            prefix: this.CONFIG.prefix,
            pdf: this.CONFIG.pdf_button,
            csv: this.CONFIG.csv_button,
            metadata: this.CONFIG.metadata_button,
            excel_label: translate.excel,
            flags_label: translate.flags,
            comma_label: translate.comma,
            codes_label: translate.codes,
            units_label: translate.units,
            period_label: translate.period,
            excel: this.CONFIG.excel_button,
            show_options: this.CONFIG.show_options,
            show_export_type:this.CONFIG.show_options,
            null_values_label: translate.null_values,
            decimal_numbers: this.CONFIG.decimal_numbers,
            decimal_numbers_label: translate.decimal_numbers,
            decimal_separators: this.CONFIG.decimal_separators,
            modal_window_button_label: this.CONFIG.button_label,
            modal_window_header_label: this.CONFIG.header_label,
            decimal_separator_label: translate.decimal_separator,
            thousand_separators: this.CONFIG.thousand_separators,
            thousand_separator_label: translate.thousand_separator,
            decimal_numbers_value: this.CONFIG.decimal_numbers_value,
            decimal_separator_comma_checked: this.CONFIG.decimal_separator_value === ',' ? 'checked' : '',
            decimal_separator_period_checked: this.CONFIG.decimal_separator_value === '.' ? 'checked' : '',
            thousand_separator_comma_checked: this.CONFIG.thousand_separator_value === ',' ? 'checked' : '',
            thousand_separator_period_checked: this.CONFIG.thousand_separator_value === '.' ? 'checked' : '',
            thousand_separator_none_checked: this.CONFIG.thousand_separator_value === '' ? 'checked' : '',
            flags_checked: this.CONFIG.flags_value ? 'checked' : '',
            codes_checked: this.CONFIG.codes_value ? 'checked' : '',
            units_checked: this.CONFIG.units_value ? 'checked' : '',
            null_values_checked: this.CONFIG.null_values_value ? 'checked' : '',
            output_type: this.CONFIG.output_type,
            output_type_label: translate.output_type,
            file_type: this.CONFIG.file_type,
            file_type_label: translate.file_type,
            table_label: translate.table,
            pivot_label: translate.pivot,
            output_type_table_checked: this.CONFIG.table_value === true ? 'checked' : '',
            output_type_pivot_checked: this.CONFIG.pivot_value === true ? 'checked' : '',
            //output_type_excel_checked: this.CONFIG.type_excel_value === true ? 'checked' : '',
            file_type_csv_checked: this.CONFIG.type_csv_value === true ? 'checked' : '',
            file_type_excel_checked: this.CONFIG.type_excel_value === true ? 'checked' : '',
            table_value: this.CONFIG.table_value,
            pivot_value: this.CONFIG.pivot_value,
            excel_value: this.CONFIG.excel_value,
           // output_export_type_excel_checked: this.CONFIG.type_excel_value === true ? 'checked' : '',
           // output_export_type_csv_checked: this.CONFIG.type_csv_value === true ? 'checked' : '',

            type_excelcsv_value:this.CONFIG.type_csv_value,

           // export_type_label: 'Download Data',
            none : translate.none
        };
        html = template(dynamic_data);

        this.$CONTAINER = $(this.CONFIG.container);

        this.$CONTAINER.html(html);

        /* Apply listeners. */
        this.apply_listeners();

    };

    OPTIONS.prototype.apply_listeners = function () {

        /* Variables. */
        var that = this;

        /* Listeners for radio button changes. */
        $('#' + this.CONFIG.prefix + 'codes').off();
        $('#' + this.CONFIG.prefix + 'codes').change(function () {
            if (that.CONFIG.callback.onCodesChange) {
                that.CONFIG.callback.onCodesChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'null_values').off();
        $('#' + this.CONFIG.prefix + 'null_values').change(function () {
            if (that.CONFIG.callback.onNullValuesChange) {
                that.CONFIG.callback.onNullValuesChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'unit').off();
        $('#' + this.CONFIG.prefix + 'unit').change(function () {
            if (that.CONFIG.callback.onUnitsChange) {
                that.CONFIG.callback.onUnitsChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'flags').off();
        $('#' + this.CONFIG.prefix + 'flags').change(function () {
            if (that.CONFIG.callback.onFlagsChange) {
                that.CONFIG.callback.onFlagsChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'output_type').off();
        $('#' + this.CONFIG.prefix + 'output_type').change(function () {
            if (that.CONFIG.callback.onOutputTypeChange) {
                that.CONFIG.callback.onOutputTypeChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'output_type_pivot').off();
        $('#' + this.CONFIG.prefix + 'output_type_pivot').change(function () {
            if (that.CONFIG.callback.onOutputTypeChange) {
                that.CONFIG.callback.onOutputTypeChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        /*
        $('#' + this.CONFIG.prefix + 'output_type_excel').off();
        $('#' + this.CONFIG.prefix + 'output_type_excel').change(function () {
            if (that.CONFIG.callback.onOutputTypeChange) {
                that.CONFIG.callback.onOutputTypeChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        */

        /*
        // AS AMANDA REQUESTED!
        $('#' + this.CONFIG.prefix + 'file_type').off();
        $('#' + this.CONFIG.prefix + 'file_type').change(function () {
            if (that.CONFIG.callback.onFileTypeChange) {
                that.CONFIG.callback.onFileTypeChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'file_type_excel').off();
        $('#' + this.CONFIG.prefix + 'file_type_excel').change(function () {
            if (that.CONFIG.callback.onFileTypeChange) {
                that.CONFIG.callback.onFileTypeChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        */

        $('#' + this.CONFIG.prefix + 'decimal_numbers').off();
        $('#' + this.CONFIG.prefix + 'decimal_numbers').change(function () {
            if (that.CONFIG.callback.onDecimalNumbersChange) {
                that.CONFIG.callback.onDecimalNumbersChange($(this).val());
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'decimal_separator').off();
        $('#' + this.CONFIG.prefix + 'decimal_separator').change(function () {
            if (that.CONFIG.callback.onDecimalSeparatorChange) {
                that.CONFIG.callback.onDecimalSeparatorChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });
        $('#' + this.CONFIG.prefix + 'decimal_separator_period').off();
        $('#' + this.CONFIG.prefix + 'decimal_separator_period').change(function () {
            if (that.CONFIG.callback.onDecimalSeparatorChange) {
                that.CONFIG.callback.onDecimalSeparatorChange($(this).is(':checked'));
            }
            amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
        });

        /* Link decimal and thousand separators. */
        if (this.CONFIG.decimal_separators && this.CONFIG.thousand_separators) {
            $("input:radio[name=" + that.CONFIG.prefix + "decimal_separator]").off();
            $("input:radio[name=" + that.CONFIG.prefix + "decimal_separator]").change(function () {
                if ($(this).val() === '.') {
                    $('#' + that.CONFIG.prefix + 'thousand_separator').prop('checked', true);
                    $('#' + that.CONFIG.prefix + 'thousand_separator_period').prop('checked', false);
                } else if ($(this).val() === ',') {
                    $('#' + that.CONFIG.prefix + 'thousand_separator').prop('checked', false);
                    $('#' + that.CONFIG.prefix + 'thousand_separator_period').prop('checked', true);
                }
                amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
            });
            $("input:radio[name=" + that.CONFIG.prefix + "thousand_separator]").off();
            $("input:radio[name=" + that.CONFIG.prefix + "thousand_separator]").change(function () {
                if ($(this).val() === '.') {
                    $('#' + that.CONFIG.prefix + 'decimal_separator').prop('checked', true);
                    $('#' + that.CONFIG.prefix + 'decimal_separator_period').prop('checked', false);
                } else if ($(this).val() === ',') {
                    $('#' + that.CONFIG.prefix + 'decimal_separator').prop('checked', false);
                    $('#' + that.CONFIG.prefix + 'decimal_separator_period').prop('checked', true);
                }

                amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);
            });
        }

    };

    OPTIONS.prototype.show = function () {

        /* Variables. */
        var that = this;

        /* Apply configuration. */
        this.apply_configuration();

        /* Add listeners for change events. */
        $('#' + this.CONFIG.prefix + 'unit').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'codes').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'flags').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'null_values').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'decimal_numbers').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'decimal_separator').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'thousand_separator').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'decimal_separator_period').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'thousand_separator_period').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'output_type').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'file_type').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'file_type_excel').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'output_type_pivot').change(function () { that.option_changed_listener(); });
        //$('#' + this.CONFIG.prefix + 'output_type_excel').change(function () { that.option_changed_listener(); });

    };

    OPTIONS.prototype.show_as_modal_window = function () {
        this.CONFIG.mode = 'window';
        this.show();
    };

    OPTIONS.prototype.show_as_panel = function () {
        this.CONFIG.mode = 'panel';
        this.show();
    };

    OPTIONS.prototype.option_changed_listener = function () {
        /*global amplify*/
        amplify.publish(this.CONFIG.prefix + 'event', this.collect_user_selection());
    };

    /**
     * Function to collect the parameters exposed by this component.
     *
     * @param {String} output_format Format of the output: 'csv', 'xls', 'pdf', null
     * @returns {Object} An object describing the selection made by the user through this component.
     */
    OPTIONS.prototype.collect_user_selection = function (output_format) {
        this.CONFIG.user_selection.decimal_separator_value = $('input[name="' + this.CONFIG.prefix + 'decimal_separator"]:checked').val();
        this.CONFIG.user_selection.thousand_separator_value = this.CONFIG.user_selection.decimal_separator_value === '.' ? ',' : '.';
        this.CONFIG.user_selection.decimal_numbers_value = $('#' + this.CONFIG.prefix + 'decimal_numbers').val();
        this.CONFIG.user_selection.flags_value = $('#' + this.CONFIG.prefix + 'flags').is(':checked');
        this.CONFIG.user_selection.table_value = $('#' + this.CONFIG.prefix + 'output_type').is(':checked');
        this.CONFIG.user_selection.pivot_value = $('#' + this.CONFIG.prefix + 'output_type_pivot').is(':checked');
        //this.CONFIG.user_selection.excel_value = $('#' + this.CONFIG.prefix + 'output_type_excel').is(':checked');
        this.CONFIG.user_selection.csv_value = $('#' + this.CONFIG.prefix + 'file_type').is(':checked');
        this.CONFIG.user_selection.xls_value = $('#' + this.CONFIG.prefix + 'file_type_excel').is(':checked');
        this.CONFIG.user_selection.codes_value = $('#' + this.CONFIG.prefix + 'codes').is(':checked');
        this.CONFIG.user_selection.units_value = $('#' + this.CONFIG.prefix + 'unit').is(':checked');
        this.CONFIG.user_selection.null_values_value = $('#' + this.CONFIG.prefix + 'null_values').is(':checked');


        //this.CONFIG.user_selection.csv_value = $('#' + this.CONFIG.prefix + 'export_type_csv').is(':checked');

        if (output_format) {
            this.CONFIG.user_selection.origin = output_format;
            this.CONFIG.user_selection.output_format = output_format;
        }
        this.CONFIG.user_selection.output_type = this.get_output_type();
        this.CONFIG.user_selection.file_type = this.get_file_type();

        return this.CONFIG.user_selection;
    };

    OPTIONS.prototype.get_output_type = function () {
        //log.info("OPTIONS.get_output_type; ", $('#' + this.CONFIG.prefix + 'output_type').is(':checked'));
        var test = $('#' + this.CONFIG.prefix + 'output_type').is(':checked');
        return test ? 'TABLE' : 'PIVOT';
    };

    OPTIONS.prototype.get_file_type = function () {
        //log.info("OPTIONS.get_file_type; ", $('#' + this.CONFIG.prefix + 'file_type').is(':checked'));
        var test = $('#' + this.CONFIG.prefix + 'file_type').is(':checked');
        return test ? 'CSV' : 'XLS';
    };

    OPTIONS.prototype.get_radio_button = function (radio_button_code) {
        //log.info("OPTIONS.get_radio_button; get_radio_button", radio_button_code);
        return $('#' + this.CONFIG.prefix + radio_button_code);
    };

    /**
     * This function execute an user-defined function by subscribing the AmplifyJS event. The user must provide a
     * callback function that takes two arguments: the first one is the object containing the user selection
     * collected by this component, while the second object contains the data to be downloaded/exported.
     *
     * @param {function} callback This function must take two objects as argument: user selection and data
     * @param {Object} callback_data Data to be downloaded/exported.
     */
    OPTIONS.prototype.onDownload = function (callback_data, callback) {
        //log.info("OPTIONS.onDownload; callback_data", callback_data, callback);
        amplify.subscribe(this.CONFIG.prefix + 'event', function (user_selection) {
            //log.info("OPTIONS.onDownload; callback_data", user_selection, callback_data);
            callback(user_selection, callback_data);
        });
    };

    OPTIONS.prototype.getSelections = function (output_format) {

        this.CONFIG.user_selection.thousand_separator_value = $('input[name="' + this.CONFIG.prefix + 'thousand_separator"]:checked').val();
        this.CONFIG.user_selection.decimal_numbers_value = $('#' + this.CONFIG.prefix + 'decimal_numbers').val();
        this.CONFIG.user_selection.flags_value = $('#' + this.CONFIG.prefix + 'flags').is(':checked');
        this.CONFIG.user_selection.table_value = $('#' + this.CONFIG.prefix + 'output_type').is(':checked');
        this.CONFIG.user_selection.pivot_value = $('#' + this.CONFIG.prefix + 'output_type_pivot').is(':checked');
        //this.CONFIG.user_selection.excel_value = $('#' + this.CONFIG.prefix + 'output_type_excel').is(':checked');
        this.CONFIG.user_selection.csv_value = $('#' + this.CONFIG.prefix + 'file_type').is(':checked');
        this.CONFIG.user_selection.xls_value = $('#' + this.CONFIG.prefix + 'file_type_excel').is(':checked');
        this.CONFIG.user_selection.codes_value = $('#' + this.CONFIG.prefix + 'codes').is(':checked');
        this.CONFIG.user_selection.output_type_value = $('input[name="' + this.CONFIG.prefix + 'output_type"]:checked').val();
        this.CONFIG.user_selection.file_type_value = $('input[name="' + this.CONFIG.prefix + 'file_type"]:checked').val();
        this.CONFIG.user_selection.units_value = $('#' + this.CONFIG.prefix + 'unit').is(':checked');
        this.CONFIG.user_selection.null_values_value = $('#' + this.CONFIG.prefix + 'null_values').is(':checked');

        //this.CONFIG.user_selection.csv_value = $('#' + this.CONFIG.prefix + 'export_type_csv').is(':checked');
        if (output_format) {
            this.CONFIG.user_selection.origin = output_format;
            this.CONFIG.user_selection.output_format = output_format;
        }
        this.CONFIG.user_selection.output_type = this.get_output_type();
        this.CONFIG.user_selection.file_type = this.get_file_type();


        var obj = {
           // type: this.CONFIG.user_selection.table_value? 'table' : 'pivot',
            type: this.CONFIG.user_selection.output_type_value.toLowerCase(),
            file: this.CONFIG.user_selection.file_type_value.toLowerCase(),
            //file: 'csv',
            options: {
                thousand_separator: this.CONFIG.user_selection.thousand_separator_value,
                decimal_separator:  this.CONFIG.user_selection.thousand_separator_value === '.' ? ',' : '.',
                show_codes: this.CONFIG.user_selection.codes_value? true : false,
                show_unit: this.CONFIG.user_selection.units_value? true : false,
                show_flags: this.CONFIG.user_selection.flags_value? true : false,
                null_values: this.CONFIG.user_selection.null_values_value
            },
            request: {
                show_codes: this.CONFIG.user_selection.codes_value? true : false,
                show_unit: this.CONFIG.user_selection.units_value? true : false,
                show_flags: this.CONFIG.user_selection.flags_value? true : false,
                null_values: this.CONFIG.user_selection.null_values_value
            }
        };

        //log.info('Options.getSelections;', obj)

        return obj;
    };

    OPTIONS.prototype.dispose = function () {
        $('#' + this.CONFIG.prefix + 'codes').off();
        $('#' + this.CONFIG.prefix + 'null_values').off();
        $('#' + this.CONFIG.prefix + 'unit').off();
        $('#' + this.CONFIG.prefix + 'flags').off();
        $('#' + this.CONFIG.prefix + 'output_type').off();
        $('#' + this.CONFIG.prefix + 'output_type_pivot').off();
        //$('#' + this.CONFIG.prefix + 'output_type_excel').off();
        $('#' + this.CONFIG.prefix + 'file_type').off();
        $('#' + this.CONFIG.prefix + 'file_type_excel').off();
        $('#' + this.CONFIG.prefix + 'decimal_numbers').off();
        $('#' + this.CONFIG.prefix + 'decimal_separator').off();
        $('#' + this.CONFIG.prefix + 'decimal_separator_period').off();
        $("input:radio[name=" + this.CONFIG.prefix + "decimal_separator]").off();
        $("input:radio[name=" + this.CONFIG.prefix + "thousand_separator]").off();
        $('#' + this.CONFIG.prefix + 'thousand_separator').off();
        $('#' + this.CONFIG.prefix + 'thousand_separator_period').off();
    };

    return OPTIONS;

});