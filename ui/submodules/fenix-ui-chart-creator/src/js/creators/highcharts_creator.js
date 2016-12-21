/*global define, amplify, Highcharts*/
define([
        'jquery',
        'underscore',
        'loglevel',
        'fx-c-c/config/creators/highcharts_template',
        'i18n!fx-c-c/nls/translate',
        // TODO: switch to module language
        //'i18n!nls/common',
        'fx-c-c/config/events',
        'highcharts',
        //'highcharts-more',
        'highcharts-heatmap',
        'highcharts-treemap',
       // 'highstock',

        //'highcharts-export',
        //'highcharts-export-csv',
        'amplify'
    ],
    function ($, _, log, baseConfig, i18n, E) {

        'use strict';

        var defaultOptions = {

                s: {
                    CONTENT: '[data-role="content"]',
                    NO_DATA: '[data-role="no_data_available"]'
                },

                // TODO: handle multilanguage?
                noData: "<div>" + i18n.no_data_available +"</div>"

            },
            e = {
                DESTROY: 'fx.component.chart.destroy',
                READY: 'fx.component.chart.ready'
            };

        function HightchartCreator(config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            this.bindEventListeners();

            return this;
        }

        HightchartCreator.prototype._validateInput = function () {

            this.o.errors = {};

            //Container
            if (!this.o.hasOwnProperty("container")) {
                this.o.errors.container = "'container' attribute not present.";
            }

            if ($(this.o.container).find(this.o.s.CONTENT) === 0) {
                this.o.errors.container = "'container' is not a valid HTML element.";
            }

            return (Object.keys(this.o.errors).length === 0);
        };


        HightchartCreator.prototype._mergeConfiguration= function(config) {

            if (this.o.chartObj && this.o.chartObj.yAxis && config.chartObj && config.chartObj.yAxis && Array.isArray( config.chartObj.yAxis)) {

                var yAxis = $.extend(true, {}, this.o.chartObj.yAxis);

                for (var i = 0; i < config.chartObj.yAxis.length; i++) {
                    config.chartObj.yAxis[i] = $.extend(true, {}, config.chartObj.yAxis[i], yAxis);
                }

            }

            $.extend(true, this.o, config);

        };


        HightchartCreator.prototype.render = function (config) {

            //this._mergeConfiguration(config);

            $.extend(true, this.o, config);

            if (this._validateInput() === true) {

                //log.info(config)

                //Init chart container
                this.$container = $(this.o.container).find(this.o.s.CONTENT);

                if (this._validateSeries() === true) {

                    // create chart
                    this._createChart();

                }else {
                    this.noDataAvailable();
                }
            } else {
                log.error(this.o.errors);
                throw new Error("FENIX hightchart_creator has not a valid configuration");
            }
        };

        HightchartCreator.prototype._createChart = function () {

            // TODO: use configuration
            Highcharts.setOptions({
                lang: {
                    decimalPoint: '.',
                    thousandsSep: ','
                }
            });

            this.o.config = $.extend(true, {},
                baseConfig,
                this.o.chartObj, {
                    chart: {
                        renderTo: this.$container[0]
                    }
                }
            );

            this.$chart = new Highcharts.Chart(this.o.config);

        };

        HightchartCreator.prototype._onValidateDataError = function () {

        };

        HightchartCreator.prototype._createConfiguration = function () {
            this.o.config = $.extend(true, {}, baseConfig, this.o.chartObj);
        };

        HightchartCreator.prototype._validateSeries = function() {

            var switchToColumn = true;

            // check that at least one serie is > 1
            if (this.o.chartObj.chart.type === 'line') {
                for(var i=0; i < this.o.chartObj.series.length; i++) {
                    for(var j=0; j < this.o.chartObj.series[i].data.length; j++) {
                        if (this.o.chartObj.series[i].data[j] !== null) {
                            if (this.o.chartObj.series[i].data.length > 1) {
                                switchToColumn = false;
                                break;
                            }
                        }
                    }
                }

                if (switchToColumn) {
                    this.o.chartObj.chart.type = 'column';
                }
            }

            for(var i = 0; i < this.o.chartObj.series.length; i++) {
                for(var j = 0; j < this.o.chartObj.series[i].data.length; j++) {
                    if (this.o.chartObj.series[i].data[j] !== null) {
                        return true;
                    }
                }
            }


            return false;
        };

        HightchartCreator.prototype.reflow = function (e) {

            if (typeof this.$container !== 'undefined') {
                log.info("HightchartCreator.reflow;", this.$container.selector);
                var c = this.$container.highcharts();
                if (c && c.reflow) {
                    c.reflow();
                }
                return true;
            }

        };

        HightchartCreator.prototype.updateChartType = function (type) {

            this.$chart = new Highcharts.Chart($.extend(true, {}, this.o.config, {
                chart: {
                    type: type
                }
            }));

        };

        HightchartCreator.prototype.noDataAvailable = function () {
            this.$container.height('auto');
            this.$container.html(this.o.noData);
        };

        HightchartCreator.prototype.bindEventListeners = function () {

            //amplify.subscribe(E.WINDOW_RESIZE, this, this.reflow);

        };

        HightchartCreator.prototype.unbindEventListeners = function () {

           amplify.unsubscribe(E.WINDOW_RESIZE, this, this.reflow);

        };

        HightchartCreator.prototype.destroy = function () {

            this.unbindEventListeners();

            if ( this.$container ) {
                var c = this.$container.highcharts();
                if (c && c.destroy) {
                    c.destroy();
                }
            }
        };


        return HightchartCreator;
    });