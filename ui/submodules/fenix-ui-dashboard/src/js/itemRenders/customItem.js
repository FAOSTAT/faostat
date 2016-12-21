/*global define, amplify */
define([
    'jquery',
    'loglevel',
    'handlebars',
    'underscore',
    'fx-ds/config/events',
    'amplify'
], function ($, log, Handlebars, _, E) {

    'use strict';

    var defaultOptions = { };

    function CustomItem(options) {
        this.o = $.extend(true, {}, defaultOptions, options);

    }

    CustomItem.prototype._bindEventListeners = function () {

    };

    CustomItem.prototype._getProcess = function () {

        // TODO: leave exportRequest?
        return this.o.filter || this.o.config.exportRequest || [];

    };

    CustomItem.prototype._getOptions = function () {

        return this.o.bridge || {};

    };

    CustomItem.prototype.render = function () {

        // this is used to switch if a model is gave or not to the widget
        if (this.o.config.hasOwnProperty("model")) {
            this._onQuerySuccess(this.o.config.model);
        }
        else {

            // retrieve dinamically the data
            var process = this._getProcess();

            log.info(process);

            amplify.publish(E.LOADING_SHOW, {container: this.o.config.container});

            this.bridge.query(process).then(
                _.bind(this._onQuerySuccess, this),
                _.bind(this._onQueryError, this)
            );

        }

    };

    CustomItem.prototype._onQuerySuccess = function (model) {

        amplify.publish(E.LOADING_HIDE, {container: this.o.config.container});

        this._render(model);

    };

    // internal rendered
    CustomItem.prototype._render = function (model) {

        var o = this.o.config,
            model = model || {},
            template = o.template.hasOwnProperty('html')? o.template.html || null: null;


        // TODO: add labels and checks!

        if (template) {
            var t = Handlebars.compile(template);
            $(o.container).html(t(model));
        }

        //this.enableExport();

    };

    CustomItem.prototype.enableExport = function () {

    };

    CustomItem.prototype.export = function () {

        var process = this._getProcess(),
            options = this._getOptions();

        amplify.publish(E.EXPORT_DATA, process, options);

    };

    CustomItem.prototype._onQueryError = function () {

        amplify.publish(E.LOADING_HIDE, {container: this.o.config.container});

        log.error("Query error");

    };

    CustomItem.prototype._unbindEventListeners = function () {

    };

    CustomItem.prototype.destroy = function () {

        this._unbindEventListeners();

        if (this.$el) {
            this.$el.remove();
        }
    };

    return CustomItem;
});