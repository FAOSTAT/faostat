/*global define*/
define([
    'fx-common/config/errors',
    'fx-common/config/events',
    'fx-common/config/config',
    'fx-common/config/config-default',
    'jquery',
    'packery',
    'draggabilly',
    'loglevel'
], function (ERR, EVT, C, DC, $, Packery, Draggabilly, log) {
    'use strict';

    var s = {
        CATALOG: "[data-role='catalog']",
        MENU: "[data-role='menu']",
        MENU_GROUPS: "[data-role='menu-group']",
        MENU_ITEMS: "[data-role='menu-item']",
        FILTER: "[data-role='filter']",
        SUMMARY: "[data-role='summary']",
        BOTTOM: "[data-role='bottom']",
        RESULTS_CONTAINER: "[data-role='results-container']",
        RESULTS: "[data-role='results']",
        RESULT: "[data-role='result']",
        PAGINATION: "[data-role='pagination']",
        ERROR_CONTAINER: "[data-role='error-container']",
        ACTIONS: "[data-role='actions']"
    };

    function FxFluidGrid(o) {
        log.info("FENIX fluid grid");
        log.info(o);

        $.extend(true, this, {initial: o}, DC, C);

        this._parseInput();

        var valid = this._validateInput();

        log.info("Fx Fluid Grid has valid input? " + JSON.stringify(valid));

        if (valid === true) {

            this._attach();

            //this._setStatus('intro');

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            return this;

        } else {
            log.error("Impossible to create Fx Fluid Grid");
            log.error(valid)
        }
    }

    FxFluidGrid.prototype.add = function ( item ){

        var toAppend = $(item);

        // append elements to container
        this.$el.append(toAppend);
        // add and lay out newly appended elements
        this.pckry.appended(toAppend[0]);

        if (this.config.drag) {

            var draggie = new Draggabilly(toAppend[0], this.config.drag);
            // bind Draggabilly events to Packery
            this.pckry.bindDraggabillyEvents(draggie);
        }

        this.redraw();

    };

    FxFluidGrid.prototype.remove = function ( item ){

        var self = this;

        $(item).each(function( index, $item ) {
            self.pckry.remove($item);
        });

        this.redraw();

    };

    FxFluidGrid.prototype.redraw = function (){
        this.pckry.layout();
    };

    /**
     * Reset the view content
     * @return {null}
     */
    FxFluidGrid.prototype.reset = function () {

        this._emptyGrid();

        this._setStatus('intro');

        log.info("FxFluidGrid reset");
    };

    /**
     * pub/sub
     * @return {Object} catalog instance
     */
    FxFluidGrid.prototype.on = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    /**
     * Dispose
     * @return {null}
     */
    FxFluidGrid.prototype.dispose = function () {

        this._emptyGrid();

        this._unbindEventListeners();

        log.info("FxFluidGrid disposed successfully");

    };

    FxFluidGrid.prototype.getItemsAmount = function () {

        var items = this.getElements() || [];
        return items.length;
    };

    FxFluidGrid.prototype.getItems = function () {
        return this.pckry.getItemElements();
    };

    FxFluidGrid.prototype.getBlankContainer = function () {
        return $('<div data-role="fx-grid-item"></div>');
    };

    // end API

    FxFluidGrid.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    FxFluidGrid.prototype._parseInput = function () {

        this.id = this.initial.id;
        this.$el = this.initial.$el;
        this.config = this.initial.config || DC.FLUID_GRID_CONFIG || C.FLUID_GRID_CONFIG;

    };

    FxFluidGrid.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set filter id
        if (!this.id) {

            window.fx_catalog_id >= 0 ? window.fx_catalog_id++ : window.fx_catalog_id = 0;

            this.id = "fx-catalog-" + String(window.fx_catalog_id);

            log.warn("Impossible to find catalog id. Set auto id to: " + this.id);
        }


        if (!this.$el) {
            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find filter container");
        }

        this.$el = $(this.$el);

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    FxFluidGrid.prototype._attach = function () {

        log.info("template attached successfully");

    };

    FxFluidGrid.prototype._initVariables = function () {

        //pub/sub
        this.channels = {};

    };

    FxFluidGrid.prototype._bindEventListeners = function () {

    };

    FxFluidGrid.prototype._addSelector = function (selector) {

        var config = this._getSelectorConfiguration(selector);

        this.filter.add(config);
    };

    FxFluidGrid.prototype._getSelectorConfiguration = function (selector) {

        if (!SelectorsRegistry.hasOwnProperty(selector)) {
            log.error("Impossible to find selector in registry: " + selector);
            return;
        }

        var config = {};
        config[selector] = $.extend(true, {}, SelectorsRegistry[selector]);

        if (!config[selector].template) {
            config[selector].template = {};
        }

        config[selector].template.title = i18nLabels[selector] || "Missing title";

        return $.extend(true, {}, config);

    };

    FxFluidGrid.prototype._refreshResults = function () {

        if (this.filter && !$.isFunction(this.filter.getValues)) {
            log.error("Filter.getValues is not a fn()");
            return;
        }

        this.current.values = this.filter.getValues();
        this.current.filter = this.filter.getValues("catalog");

        var valid = this._validateQuery();

        if (valid === true) {
            this._search();
            this._hideError();
        } else {

            if (Array.isArray(valid) && valid[0] === ERR.empty_values) {
                this._setStatus("intro")
            }
            else {
                this._showError(valid);
            }
        }
    };

    FxFluidGrid.prototype._validateQuery = function () {

        var valid = true,
            errors = [];

        if ($.isEmptyObject(this.current.filter)) {
            errors.push(ERR.empty_values);
            log.error(ERR.empty_values);
            return errors;
        }

        return errors.length > 0 ? errors : valid;
    };

    FxFluidGrid.prototype._initComponents = function () {


        var config = $.extend(true, {}, this.config);

        config.drag.containment = this.$el[0];

        this.pckry = new Packery(this.$el[0], config);

        var itemElems = this.pckry.getItemElements();

        for (var i = 0; i < itemElems.length; i++) {
            var elem = itemElems[i];
            // make element draggable with Draggabilly
            var draggie = new Draggabilly(elem, this.config.drag);
            // bind Draggabilly events to Packery
            this.pckry.bindDraggabillyEvents(draggie);
        }

    };

    FxFluidGrid.prototype._emptyGrid = function () {

        this.remove(this.getItems());
    };

    FxFluidGrid.prototype._setStatus = function (status) {

        log.info("Set status to: " + status);

        this.$el.find(s.BOTTOM).attr('data-status', status);

    };

    FxFluidGrid.prototype._getEventName = function (evt, excludeId) {

        var baseEvent = EVT[evt] ? EVT[evt] : evt;

        return excludeId === true ? baseEvent : baseEvent + "." + this.id;
    };

    //disposition

    FxFluidGrid.prototype._unbindEventListeners = function () {

    };

    return FxFluidGrid;
});