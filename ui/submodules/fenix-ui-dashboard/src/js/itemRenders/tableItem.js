/*global define, amplify */
define([
    'jquery',
    'loglevel',
    'underscore',
    'fs-t-c/table',
    //'fs-dt-c/table',
    'fx-ds/config/events',
    'amplify'
], function ($, log, _, TableCreator, E) {

    'use strict';

    var defaultOptions = {

        };

    var s = {

        EXPORT: '[data-role="export"]'
        //EXPORT_ON_TOOLBAR: '.fixed-table-toolbar'

    };

    function TableItem(options) {
        this.o = $.extend(true, {}, defaultOptions, options);

        this._bindEventListeners();

        this.tableCreator = new TableCreator();

    }

    TableItem.prototype._bindEventListeners = function () {

    };

    TableItem.prototype._getProcess = function () {

        // TODO: leave exportRequest?
        return this.o.filter || this.o.config.exportRequest || [];

    };

    TableItem.prototype._getOptions = function () {

        return this.o.bridge ||{};

    };

    TableItem.prototype.render = function () {

        // this is used to switch if a model is gave or not to the widget
        if (this.o.config.hasOwnProperty("model")) {
            this._onQuerySuccess(this.o.config.model);
        }
        else {

            // retrieve dinamically the data
            var process = this._getProcess();

            amplify.publish(E.LOADING_SHOW, {container: this.o.config.container});

            this.bridge.query(process).then(
                _.bind(this._onQuerySuccess, this),
                _.bind(this._onQueryError, this)
            );
        }

    };

    TableItem.prototype._onQuerySuccess = function (model) {

        amplify.publish(E.LOADING_HIDE, {container: this.o.config.container});

        this.tableCreator.render($.extend(true, {},
            this.o.config, {
            model: model
        }));

        this.enableExport();

    };

    TableItem.prototype.enableExport = function () {

        var self = this;

        $(this.o.config.container).find(s.EXPORT).on('click', function(e){
            self.export();
        });

    };

    TableItem.prototype.export = function () {

        var process = this._getProcess(),
            options = this._getOptions();

        amplify.publish(E.EXPORT_DATA, process, options);

    };

    TableItem.prototype._onQueryError = function (e) {

        amplify.publish(E.LOADING_HIDE, {container: this.o.config.container});

        log.error("TableItem._onQueryError", e);

    };

    TableItem.prototype._unbindEventListeners = function () {

    };

    TableItem.prototype.destroy = function () {

        this._unbindEventListeners();

        if (this.$el) {
            this.$el.remove();
        }

    };

    return TableItem;
});