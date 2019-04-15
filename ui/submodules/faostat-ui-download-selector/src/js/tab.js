/*global define, amplify*/
/*jslint nomen: true*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'faostatapiclient',
    // Add selector
    'jstree',
    'underscore',
    'amplify'
], function ($, log, E, API, Tree, _) {

    'use strict';

    var s = {

            TREE: '[data-role="tree"]'

        },

        defaultOptions = {

        };

    function Tab() {

        return this;

    }

    Tab.prototype.init = function (config) {

        this.o = $.extend(true, {}, defaultOptions, config);
        this.summary = this.o.summary;
        this.cache = {};

        //log.info('Tab.init;', this.o);

        this.initVariables();
        this.initComponents();

    };

    Tab.prototype.initVariables = function () {

        //log.info('Tab.initVariables;', this.o);

        this.$CONTAINER = $(this.o.container);

        this.$TREE = this.$CONTAINER.find(s.TREE);

        amplify.publish(E.LOADING_SHOW, { container: this.$TREE });

    };

    Tab.prototype.initComponents = function () {

        var id = this.o.dimension.id,
            domain_code = this.o.code,
            // TODO: report_code should came from the dimension API?
            report_code = this.o.report_code || null,
            r = {
                id: id,
                domain_code: domain_code,
                show_lists: true
            },
            // add report code if not null
            r = (report_code !== null)? $.extend(true, r, {report_code: report_code}): r,
            self = this;

        // retrieve all codes for the subdimension
        API.codes(r).then(function(d) {

            if (d.data.length > 0) {
                self.initTree(d);
            }
            else {
                // TODO: make it multilingual and nicer
                self.$TREE.html('<h5 style="text-align: center;">No selection available</h5>');
            }

        });

    };

    Tab.prototype.initTree = function (d) {

        this.cache.data = $.extend(true, {}, d.data);

        var data = this.prepareTreeData(d),
            // TODO: make it nicer and robust
            //multiple = this.o.multiple,
            multiple = (this.o.dimension.options.selectType === 'multi'),
            // in case is it a single node it will be selected automatically if the tab is visible
            isSingleNode = d.data.length === 1? true: false,
            self = this;

        /* Init JSTree. */
        this.$TREE.jstree({

            'plugins': ['checkbox', 'unique', 'search', 'striped', 'types', 'wholerow'],

            'core': {
                'multiple': multiple,
                'data': data,
                'themes': {
                    'stripes': true,
                    'icons': false
                }
            },

            'search': {
                'fuzzy': false,
                'show_only_matches': true,
                'close_opened_onclear': false
            }

        });

        // Binding on node selection
        this.$TREE.on('select_node.jstree', function (e, data) {

            //self.summary.add([data.node.li_attr]);
            self.refreshSummary();

        });

        this.$TREE.on('deselect_node.jstree', function (e, data) {

            //self.summary.remove(data.node.li_attr);

            // refresh summary
            self.refreshSummary();

        });

        this.$TREE.on('ready.jstree', function (e, data) {

            // in case is it a single node it will be selected automatically if the tab is visible
            if(self.$TREE.is(":visible") && isSingleNode) {
                self.$TREE.jstree('select_node', 'ul > li:first');
            }

            // refresh summary
            self.refreshSummary();

            // callback
            if(self.o.callback !== undefined && _.isFunction(self.o.callback)) {
                self.o.callback(self);
            }

        });

    };

    Tab.prototype.prepareTreeData = function (d) {

        var data = [],
            self = this;

        _.each(d.data, function(v) {

            var id = v.code,
                code =  v.code,
                label = v.label,
                parent = self.prepareTreeNodeParent(v, d.data),
                node = {
                    id: id,
                    text: label,
                    parent: parent,
                    li_attr: {
                        code: code,
                        label: label
                    },
                    state: {
                        //selected: true  // is the node selected
                    }
                };

            data.push(node);

        });

        return data;
    };

    Tab.prototype.prepareTreeNodeParent = function (v, data) {

        var id = v.parent? v.parent: undefined;

        if(id === undefined) {
            //log.info("Tab.prepareTreeNodeParent;undefined;", id, v)
            return "#";
        }

        //log.info("Tab.prepareTreeNodeParent;", id);
        if (id === '0') {
            return '#';
        }

        for(var i=0; i < data.length; i++) {
            //log.info("Tab.prepareTreeNodeParent;check;", data[i].code, id, data[i].code === id);
            if (data[i].code === id) {
                return id;
            }
        }

        // return null or "#"? (not in hierarchy?)
        return '#';

    };

    Tab.prototype.refreshSummary = function () {

        this.summary.refresh();

    };

    Tab.prototype.selectAll = function () {

        this.$TREE.jstree("check_all");

        this.refreshSummary();

    };

    Tab.prototype.deselectAll = function () {

        this.$TREE.jstree("uncheck_all");

        this.refreshSummary();

    };

    Tab.prototype.select = function (item) {

        this.$TREE.jstree("check_node", item.id);

        this.refreshSummary();

    };

    Tab.prototype.deselect = function (item) {

        //log.info("Tab.deselect; item:", item);

        this.$TREE.jstree("uncheck_node", item.id);

        this.refreshSummary();

    };

    Tab.prototype.getID = function () {

        return this.o.id;

    };

    Tab.prototype.search = function (word) {

        this.$TREE.jstree(true).search(word);

    };

    Tab.prototype.getFirstValue = function () {
        
        if (this.cache !== undefined && this.cache.hasOwnProperty('data')) {
            if ( this.cache.data[0] !== undefined ) {
                return this.cache.data[0].label;
            }
        }

    };

    Tab.prototype.getSelected = function () {

        var selected = this.$TREE.jstree("get_selected"),
            self = this,
            values = [];

        _.each(selected, function(s) {


            if (self.$TREE.jstree(true)) {

                var node = self.$TREE.jstree(true).get_node(s);

                values.push(node.li_attr);
            }

        });

        return values;

    };

    Tab.prototype.destroy = function () {

        log.info('Tab.destroy;');

    };

    return Tab;

});