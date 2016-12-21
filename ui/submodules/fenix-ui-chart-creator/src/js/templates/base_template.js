/*global define, Highcharts */
define([
        'jquery',
        'handlebars',
        //'text!fx-c-c/html/templates/base_template.hbs'
        'text!fx-c-c/html/templates/custom_template.hbs',
        'i18n!fx-c-c/nls/translate',
        'loglevel',
        // avoid to import here Highcharts?
        'highcharts',
        'highcharts-export',
        //'highcharts-regression',
        'bootstrap'
    ],
    function ($, Handlebars, template, i18n, log) {

        'use strict';

        var defaultOptions = {};

        function Base_template(config) {
            // this should be always reinitialized
            this.o = $.extend(true, {}, defaultOptions, config);
            return this;
        }

        Base_template.prototype.render = function () {

            if (this._validateInput() === true) {
                this._initHighchartsConfig();
                this._initVariable();
                this._injectTemplate(template);
            } else {
                log.error(this.o.errors);
                throw new Error("FENIX Chart creator has not a valid configuration");
            }

            return this;
        };

        // TODO: should be set at each chart creation?
        Base_template.prototype._initHighchartsConfig =function(){

            Highcharts.setOptions({
                lang: {
                    contextButtonTitle: i18n.contextButtonTitle,
                    downloadJPEG: i18n.downloadJPEG,
                    downloadPDF: i18n.downloadPDF,
                    downloadPNG: i18n.downloadPNG,
                    downloadSVG: i18n.downloadSVG,
                    printChart: i18n.printChart,
                    resetZoom: i18n.resetZoom,
                    resetZoomTitle: i18n.resetZoomTitle
                }
            });

        };

        Base_template.prototype._injectTemplate = function () {

            var t = Handlebars.compile((this.o.hasOwnProperty('html'))? this.o.html || template: template);

            if ( this.o.$container) {
                this.o.$container.html(t($.extend({}, true, i18n, this.o)));
                this.o.$container.find('[data-toggle="tooltip"]').tooltip();
            }

        };

        Base_template.prototype._initVariable = function () {
            this.o.$container = $(this.o.container);
        };

        Base_template.prototype._validateInput = function () {

            this.o.errors = {};

            if (!this.o.hasOwnProperty("container")) {
                this.o.errors.container = "'container' attribute not present";
            }

            return (Object.keys(this.o.errors).length === 0);
        };

        Base_template.prototype.destroy = function () {

        };

        return Base_template;
    });