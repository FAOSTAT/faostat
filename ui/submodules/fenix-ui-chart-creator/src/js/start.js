/*global define, console*/
define([
        'jquery',
        'loglevel',
        'fx-c-c/adapters/FAOSTAT_adapter',
        'fx-c-c/templates/base_template',
        'fx-c-c/creators/highcharts_creator'
    ],
    function ($, log, Adapter, Template, Creator) {

        'use strict';

        var defaultOptions = {};

        function ChartCreator() {
            $.extend(true, this, defaultOptions);
            return this;
        }

        ChartCreator.prototype.init = function (config) {

            this.dfd = $.Deferred();

            var self = this;
            this.config = config;

            try {
                if (this._validateInput(config)) {
                    this.preloadResources(config);
                }
            } catch (e) {
                self.onError(e);
            }

            // Return the Promise so caller can't change the Deferred
            return this.dfd.promise();

        };
        
        ChartCreator.prototype.addTimeserieData = function (config) {

            this.adapter.prepareData($.extend(true, {model: config.model}, config.adapter));
            this.adapter.prepareChart(config || {});

            return this;

        };

        ChartCreator.prototype.render = function (c) {

            this.config = $.extend(true, {}, this.config, c);
            // TODO: should saved in this.config?
            var  chartObj = {},
                config = this.config;

            this.template = new Template($.extend(
                true,
                {},
                {container: config.container},
                config.template
            ));

            this.creator = new Creator($.extend(
                true,
                {},
                {container: config.container, noData: config.noData},
                config.creator
            ));

            // this is done for the timeseries that doesn't require to prepare and process the chart data because
            // they are processed each time there are new data available
            if (config.hasOwnProperty('useAdapterChartObj') && config.useAdapterChartObj === true) {
                chartObj = this.adapter.getChartObj();
            }else {
                this.adapter.prepareData($.extend(true, {model: config.model}, config.adapter));
                chartObj = this.adapter.prepareChart(config.adapter || {});
            }

            try {

                // render chart
                this.template.render();
                this.creator.render({chartObj: chartObj});

                this.bindEventListeners();

            } catch (e) {
                // TODO: Handle the error
                log.error("ChartCreator.render", e);
                this.creator.noDataAvailable();
            }

            return this;
        };

        ChartCreator.prototype.preloadResources = function (config) {

            this.adapter = new Adapter($.extend(true, {model: config.model}, config.adapter));

            this.dfd.resolve(this);

        };

        ChartCreator.prototype.bindEventListeners = function () {

            var self = this;

            $(this.config.container).find('[data-role="chart-switch"] a').on('click', function(e) {
                e.preventDefault();
                self.creator.updateChartType($(this).data("type"));
            })

        };

        ChartCreator.prototype.unbindEventListeners = function () {

            $(this.config.container).find('[data-role="chart-switch"]').off();

        };

        ChartCreator.prototype.onError = function (e) {
            log.error("ChartCreator Error: ", e);
            // TODO: Add an Error message
            this.dfd.reject("ChartCreator Error: ", e);
        };

        ChartCreator.prototype._validateInput = function () {
            return true;
        };

        ChartCreator.prototype.destroy = function () {

            if ( this.template ) {
                log.info('Chart creator destroy ', this.template.o.title);
                this.template.destroy();
            }
            if( this.creator) {
                // TODO: handle destroy
                this.creator.destroy();
            }

            this.unbindEventListeners();

        };

        return ChartCreator;
        
    });