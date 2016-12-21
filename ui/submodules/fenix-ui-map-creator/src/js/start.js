/*global define, amplify*/
define([//'require',
        'jquery',
        'loglevel',
        'q',
        'fx-m-c/config/events',
        'fx-m-c/templates/base_template',
        // 'fx-m-c/adapters/FENIX_fx_map',
        'fx-m-c/adapters/FAOSTAT_fx_map',
        'amplify'
    ],
    function ($, log, Q, E, Template, Adapter) {

        'use strict';

        var defaultOptions = {};

        function MapCreator() {
            $.extend(true, this, defaultOptions);
            return this;
        }

        MapCreator.prototype.render = function (config) {
            this.deferred = Q.defer();

            try {
                if (this._validateInput(config)) {
                    this.preloadResources(config);

                    this.bindEventListeners();

                }
            }catch(e) {
                this.onError(e);
            }

            return this.deferred.promise;
        };

        MapCreator.prototype.preloadResources = function ( config ) {

            this.template = new Template();
            this.adapter = new Adapter();

            //currently both of them are sync fns
            this.template.render(config);
            this.adapter.render(config);

            if (typeof config.onReady === 'function') {
                config.onReady(this);
            }

            this.deferred.resolve(this);

        };

        MapCreator.prototype._validateInput = function () {
            return true;
        };

        MapCreator.prototype.getContainer = function () {
            return this.template.container;
        };

        MapCreator.prototype.addBaseLayer = function (layer) {
            return this.adapter.addBaseLayer(layer);
        };

        // Handle Layers
        MapCreator.prototype.addLayer = function (model, layerOptions, modelOptions) {
            return this.adapter.addLayer(model, layerOptions, modelOptions);
        };

        // TODO: dirty no data available
        MapCreator.prototype.noDataAvailable = function () {
            log.info('MapCreator.noDataAvailable;');
            this.template.noDataAvailable();
        };

        MapCreator.prototype.removeLayer = function (layer) {
            return this.adapter.removeLayer(layer);
        };

        MapCreator.prototype.addCountryBoundaries = function () {
            return this.adapter.addCountryBoundaries();
        };

        MapCreator.prototype.invalidateSize = function () {

            log.info('MapCreator.invalidateSize;', this.template.template.title);
            // dirty fix for invalidate size
            return this.adapter.invalidateSize();

        };

        MapCreator.prototype.addLayer = function (model, layerOptions, modelOptions) {
            return this.adapter.addLayer(model, layerOptions, modelOptions);
        };

        MapCreator.prototype.bindEventListeners = function () {

            amplify.subscribe(E.WINDOW_RESIZE, this, this.invalidateSize);

        };

        MapCreator.prototype.unbindEventListeners = function () {

            amplify.unsubscribe(E.WINDOW_RESIZE, this, this.invalidateSize);

        };

        MapCreator.prototype.destroy = function () {

            //log.info('MapCreator.destroy;', this.template.template.title);

            this.unbindEventListeners();

        };

        return MapCreator;

    });