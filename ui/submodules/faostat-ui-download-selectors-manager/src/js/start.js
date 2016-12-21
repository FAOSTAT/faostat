/*global define, amplify*/
/*jslint nomen: true*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'text!fs-s-m/html/template.hbs',
    'faostatapiclient',
    'fs-s/start',
    'handlebars',
    'underscore',
    // Add selector
    'amplify'
], function ($, log, E, template, API, Selector, Handlebars, _) {

    'use strict';

    var s = {
            SELECTORS_GRID: '[data-role="selectors_grid"]'
    },
    templateFilter = {
        CONTAINER: '#selector_manager_container',
        SINGLE_SELECTOR: '#single_selector'
    },
    defaultOptions = {
        validateEmptySelection: true
    };

    function SelectorsManager() {

        return this;

    }

    SelectorsManager.prototype.init = function (config) {

        this.o = $.extend(true, {}, defaultOptions, config);

        //log.info('SelectorsManager.init;', this.o);

        this.initVariables();
        this.initComponents();
        this.bindEventListeners();

    };

    SelectorsManager.prototype.initVariables = function () {

        this.$CONTAINER = $(this.o.container);

        var html = $(template).filter(templateFilter.CONTAINER).html(),
        t = Handlebars.compile(html);

        // init structure
        this.$CONTAINER.html(t({}));

        // init grid
        this.$SELECTORS_GRID = this.$CONTAINER.find(s.SELECTORS_GRID);

        amplify.publish(E.LOADING_SHOW, { container: this.$CONTAINER });

    };

    SelectorsManager.prototype.initComponents = function () {

        var code = this.o.code,
            report_code = this.o.report_code || null,
            self = this,
            r = {
                domain_code: code,
                full: true
            },
            r = (report_code !== null)? $.extend(true, {}, r, {report_code: report_code}): r;

        // initialize selectors
        this.selectors = [];

        // retrieve all dimensions
        API.dimensions(r).then(function(dimensions) {

            amplify.publish(E.LOADING_HIDE, { container: self.$CONTAINER });

            //var parameters = dimensions.metadata.parameters || {};
            var parameters = {
                report_code: report_code
            };
            self.o.dimensions = dimensions;

            _.each(dimensions.data, function (d, index) {
                self.selectors.push(self.createSelector(d, parameters, index));
            });

        }).catch(function(e) {
            log.error("SelectorsManager.initComponents; API Problem on retrieving dimensions.");
            amplify.publish(E.CONNECTION_PROBLEM);
            //amplify.publish(E.LOADING_HIDE, { container: self.$CONTAINER });
        });

    };

    // create a single selector
    SelectorsManager.prototype.createSelector = function (dimension, parameters, index) {

      // init selector div
      var selector = new Selector(),
          code = this.o.code,
          html = $(template).filter(templateFilter.SINGLE_SELECTOR).html(),
          t = Handlebars.compile(html),
          id = 'selector_' + Math.random().toString().replace('.', ''),
          multipleSelection = this.o.multiple;

        this.$SELECTORS_GRID.append(t({
            id: id,
            addClearFix: (index % 2)? true: false
        }));

        log.info("SelectorsManager.createSelector; dimension", dimension, parameters);

        // add selector container
        selector.init($.extend(true, {},
            dimension,
            {
                container: this.$SELECTORS_GRID.find('#' + id),
                code: code,
                // TODO: report_code should came from the dimension API?
                report_code: parameters.report_code,
                dimension: dimension,
                // TODO: this should be at the level of subdimension
                multiple: multipleSelection
            }));

        return selector;
    };

    SelectorsManager.prototype.getSelections = function () {

        var selections = [];

        _.each(this.selectors, function(s) {
            selections.push(s.getSelections());
        });

        //log.info('SelectorsManager.getSelections; ', selections);

        // validate if one selection is empty
        if ( this.o.validateEmptySelection ) {
            if ( this.isEmpty(selections) ) {
                throw new Error("The user didn't select at least one item");
            }
        }

        return selections;

    };

    SelectorsManager.prototype.isEmpty = function (selections) {

        for(var i=0; i < selections.length; i++) {
            if (selections[i] === undefined || selections[i].codes.length <= 0) {
                log.error('SelectorsManager.isEmpty; Selector (', i, ') is Empty' );
                return true;
            }
        }

        return false;

    };

    SelectorsManager.prototype.bindEventListeners = function () {

    };

    SelectorsManager.prototype.unbindEventListeners = function () {

    };

    SelectorsManager.prototype.isValid = function (dimensions) {
        // TODO: to implement a validation
        return truel
    };

    SelectorsManager.prototype.destroy = function () {

        log.info('SelectorsManager.destroy;');

        // for each Selector call it's destroy
        _.each(this.selectors, function(s) {
            if(s && _.isFunction(s.destroy)) {
                s.destroy();
            }
        });

    };

    return SelectorsManager;

});