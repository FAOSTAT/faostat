/*global define, amplify */
define([
    'jquery',
    'loglevel',
    'underscore',
    'fx-c-c/start',
    // TODO: this is should be
    'fx-ds/config/events',
    'amplify'
], function ($, log,  _, ChartCreator, E) {

    'use strict';

    var defaultOptions = {

    }, s = {

        EXPORT: '[data-role="export"]'

    };

    function ChartItem(options) {

        this.o = $.extend(true, {}, defaultOptions, options);
        this.o.originalOptions =  $.extend(true, {},   this.o);

        this._bindEventListeners();

        this.chartCreator = new ChartCreator();

    }

    ChartItem.prototype._bindEventListeners = function () {

    };

    ChartItem.prototype._getProcess = function () {

        return this.o.filter || [];

    };

    ChartItem.prototype._getOptions = function () {

        return this.o.bridge ||{};

    };

    ChartItem.prototype._getBridge = function () {

        return this.o.bridge || [];

    };

    ChartItem.prototype.render = function () {

        var process = this._getProcess();

        amplify.publish(E.LOADING_SHOW, {container: this.$el});

       // log.info("ChartItem.render;", process);

        //try {
            this.bridge.query(process)
                .then(_.bind(this._onQuerySuccess, this), _.bind(this._onQueryError, this));
/*        }catch(e) {
            this._onQueryError();
        }*/
    };

    ChartItem.prototype._onQuerySuccess = function (model) {

        //this.o.model = model;
        this.o.model = model;

        // add to default config the chart export parameters
        this.o.config = $.extend(true, {},
            this.o.config,
            this.addExportChartImageParameters(this.o.config)
        );

        var chartConfig = $.extend(true, {},
            this.o.config,
            {
                model : this.o.model
            }
        );

        this.chartCreator.init(chartConfig).then(
            _.bind(this.renderCharts, this)
        );

    };

    ChartItem.prototype.renderCharts = function(creator) {

        this.chartCreator = creator;

        this.chartCreator.render();

        this.enableExport();

    };

    ChartItem.prototype.addExportChartImageParameters = function(config) {

        var title = config.hasOwnProperty('template')? config.template.title: null,
            subtitle = config.hasOwnProperty('template')? config.template.subtitle: null;

        return {
            creator: {
                chartObj: {
                    exporting: {
                        enabled: true,
                        chartOptions:{
                            title: {
                                enabled: true,
                                text: title
                            },
                            subtitle: {
                                enabled: true,
                                text:  subtitle
                            },
                            legend:{
                                enabled:true
                            }
                        }
                    }
                }
            }
        };

    };

    ChartItem.prototype._onQueryError = function (e) {

        amplify.publish(E.LOADING_HIDE, {container: this.$el});

        log.error("ChartItem._onQueryError;", e);

    };

    ChartItem.prototype.enableExport = function () {

        var self = this;

        $(this.o.config.container).find(s.EXPORT).on('click', function(){
            self.export();
        });

    };

    ChartItem.prototype.export = function () {

        var process = this._getProcess(),
            options = this._getOptions();

        //log.info("ChartItem.export;", process, options);

        amplify.publish(E.EXPORT_DATA, process, options);

    };

    ChartItem.prototype._unbindEventListeners = function () {

        $(this.o.config.container).find(s.EXPORT).off('click');

    };

    ChartItem.prototype.getOptions = function() {
        return this.o.originalOptions;
    };

    ChartItem.prototype.destroy = function () {

       this._unbindEventListeners();

        if ( this.chartCreator) {
            this.chartCreator.destroy();
        }

        if (this.$el) {
            this.$el.remove();
        }

    };

    return ChartItem;
});