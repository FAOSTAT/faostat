/*global define, amplify*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'text!fs-s/html/templates.hbs',
    'i18n!fs-s/nls/translate',
    'handlebars',
    'underscore',
    'amplify'
], function ($, log, E, template, i18nLabels, Handlebars, _) {

    'use strict';

    var s = {

            SUMMARY_ITEM: '[data-role="summary-item"]'

        },

        defaultOptions = {

            onRemove: 'callback',

            // validate if there is at least one selection
            validateEmptySelection: true,

            multiple: true

    };

    function Summary() {

        return this;

    }

    Summary.prototype.init = function (config) {

        this.o = $.extend(true, {}, defaultOptions, config);

        //log.info('Summary.init;', this.o);

        this.initVariables();
        this.initComponents();

    };

    Summary.prototype.initVariables = function () {

        this.$CONTAINER = $(this.o.container);

        // selections
        this.selections = {};

    };

    Summary.prototype.initComponents = function () {

    };

    Summary.prototype.getTreeSelections = function () {

        var self = this,
            selections = [];

        _.each(this.tabs, function(tab) {

            var values = tab.getSelected();

            // TODO: how the sort should work? for the years is not valid the order
            // sort for each tab in order
            selections.push.apply(selections, _.sortBy(values, 'label'));

        });

        return selections;

    };

    Summary.prototype.refresh = function () {

        this.render(this.getTreeSelections());

    };

    Summary.prototype.render = function (selections) {

        var html = $(template).filter('#summary_item').html(),
            t = Handlebars.compile(html);

        this.$CONTAINER.html(t({items: selections}));

        this.bindEventListeners();

        amplify.publish(E.DOWNLOAD_SELECTION_CHANGE);

    };
    Summary.prototype.remove = function (item) {

        this.o.onRemove(item);

    };

    Summary.prototype.deselectAll = function () {

        this.refresh();

    };

    Summary.prototype.deselectAll = function () {

        this.refresh();

    };

    Summary.prototype.getSelections = function () {

        var codes = [],
            selections = this.getTreeSelections();

        if ( !_.isEmpty(selections)) {
            _.each(Object.keys(selections), function(id) {
                codes.push(selections[id].code);
            });
        }
        else {
            if ( this.o.validateEmptySelection ) {

                // TODO: there could be an event with a timer "lock"
                amplify.publish(E.SCROLL_TO_SELECTOR, { container: this.$CONTAINER.parent().parent().parent().parent().parent()});
                //$("html, body").animate({ scrollTop: this.$CONTAINER.parent().parent().parent().parent().parent().offset().top}, "slow");
                //$('html, body').animate({ scrollTop: this.$CONTAINER.parent().parent().offset().top }, 'slow');
                // TODO: move to template
                this.$CONTAINER.html('<h4 style="color:red">'+ i18nLabels.please_make_one_selection + '</h4>');
            }
        }

        return codes;

    };

    Summary.prototype.addTabs = function (tabs) {

        this.tabs = tabs;

    };

    Summary.prototype.bindEventListeners = function () {

        var self = this;

        this.$CONTAINER.find(s.SUMMARY_ITEM).off('click');
        this.$CONTAINER.find(s.SUMMARY_ITEM).on('click', function(e) {

            var id = $(e.target).data('id');

            self.remove({
                id: id
            });

            $(e.target).remove();

        });

    };

    Summary.prototype.unbindEventListeners = function () {

        this.$CONTAINER.find(s.SUMMARY_ITEM).off('click');

    };

    Summary.prototype.destroy = function () {

        log.info('Summary.destroy;');

        this.unbindEventListeners();

        this.$CONTAINER.empty();

    };

    return Summary;

});