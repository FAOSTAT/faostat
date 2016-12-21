/*global define*/
define(['jquery',
        'loglevel',
        'faostatapiclient',
        'jstree',
        'amplify'
], function ($, log, API) {

    'use strict';

    // TODO: refactor
    function TREE() {

        this.CONFIG = {

            w: null,
            code: null,
            group: null,
            domain: null,

            //datasource: 'faostat',
            max_label_width: null,
            prefix: 'faostat_tree_',
            placeholder_id: 'placeholder',
            blacklist: [],
            whitelist: [],
            section: 'download',

            placeholder_search: null,

            /* Events to destroy. */
            callback: {
                onClick: null,
                onGroupClick: null,
                onDomainClick: null,
                onTreeRendered: null
            }

        };

    }

    TREE.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Render. */
        this.render();

    };

    TREE.prototype.render = function () {

        /* Variables. */
        var self = this;

        if (this.CONFIG.placeholder_id instanceof $) {
            this.tree = this.CONFIG.placeholder_id;
        }else{
            /* Store JQuery object.. */
            this.tree = $(this.CONFIG.placeholder_id).length > 0 ? $(this.CONFIG.placeholder_id) : $("#" + this.CONFIG.placeholder_id);
        }

        // add tree class
        this.tree.addClass('fs-tree');

        //this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        if (this.CONFIG.custom) {
            // create a custom tree
            self.createTree(this.CONFIG.custom);
        }
        else {
            /* Fetch FAOSTAT groups and domains. */
            API.groupsanddomains({
                section: this.CONFIG.section
            }).then(function (json) {
                self.createTree(self.prepareAPIData(json));
            });
        }

    };

    TREE.prototype.prepareAPIData = function (json) {

        var payload = [];

        if (this.CONFIG.whitelist.length > 0) {
            payload = this.filterDataWhitelist(json);
        }
        else {
            payload = this.filterData(json);
        }

        return payload;
    };

    TREE.prototype.filterDataWhitelist = function (json) {

        /* Buffer. */
        var buffer = [],
            payload = [];

        for (var i = 0; i < json.data.length; i++) {

            /* Create group node. */
            if ($.inArray(json.data[i].group_code, this.CONFIG.whitelist) >= 0) {
                if ($.inArray(json.data[i].group_code, buffer) < 0) {
                    buffer.push(json.data[i].group_code);
                    payload.push({
                        id: json.data[i].group_code,
                        text: json.data[i].group_name,
                        li_attr: {
                            id: json.data[i].group_code,
                            label: json.data[i].group_name,
                            date_update: json.data[i].date_update
                        },
                        parent: '#'
                    });
                }

                /* Add domain node. */
                if ($.inArray(json.data[i].domain_code, this.CONFIG.whitelist) >= 0) {
                    payload.push({
                        id: json.data[i].domain_code,
                        text: json.data[i].domain_name,
                        li_attr: {
                            id: json.data[i].domain_code,
                            label: json.data[i].domain_name,
                            date_update: json.data[i].date_update
                        },
                        parent: json.data[i].group_code
                    });
                }
            }
        }

        return payload;

    };

    TREE.prototype.filterData = function (json) {

        /* Buffer. */
        var buffer = [],
            payload = [];

        for (var i = 0; i < json.data.length; i++) {
            /* Create group node. */
            if ($.inArray(json.data[i].group_code, this.CONFIG.blacklist) < 0) {
                if ($.inArray(json.data[i].group_code, buffer) < 0) {
                    buffer.push(json.data[i].group_code);
                    payload.push({
                        id: json.data[i].group_code,
                        text: json.data[i].group_name,
                        li_attr: {
                          id: json.data[i].group_code,
                          label: json.data[i].group_name,
                          date_update: json.data[i].date_update
                        },
                        parent: '#'
                    });
                }

                /* Add domain node. */
                if ($.inArray(json.data[i].domain_code, this.CONFIG.blacklist) < 0) {
                    payload.push({
                        id: json.data[i].domain_code,
                        text: json.data[i].domain_name,
                        li_attr: {
                            id: json.data[i].domain_code,
                            label: json.data[i].domain_name,
                            date_update: json.data[i].date_update
                        },
                        parent: json.data[i].group_code
                    });
                }
            }
        }

        return payload;

    },

    TREE.prototype.createTree = function (data) {

        var self = this;

        /* Init JSTree. */
        this.tree.jstree({

            plugins: ['unique', 'search', 'types', 'wholerow'],

            core: {
                data: data,
                themes: {
                    icons: false,
                    responsive: false,
                    stripes: true
                }
            },

            search: {
                show_only_matches: true,
                close_opened_onclear: false
            }

        });

        /* Implement node selection. */
        this.tree.on('activate_node.jstree', function (e, data) {

            /* Fetch node. */
            var node = data.node;


            /* Generic click listener, or specific listeners for groups and domains. */
            if (self.CONFIG.callback.onClick) {
                if (node.parent === '#') {
                    node.parent === '#' && self.tree.jstree().is_open() ? self.tree.jstree().close_node(node) : self.tree.jstree().open_node(node);
                }
                if (self.CONFIG.callback.onClick) {
                    self.CONFIG.callback.onClick(self.getNodeAttributes(node));
                }
            } else {
                if (node.parent === '#') {
                    node.parent === '#' && self.tree.jstree().is_open() ? self.tree.jstree().close_node(node) : self.tree.jstree().open_node(node);
                    if (self.CONFIG.callback.onGroupClick) {
                        self.CONFIG.callback.onGroupClick(self.getNodeAttributes(node));
                    }
                } else {
                    if (self.CONFIG.callback.onDomainClick) {
                        self.CONFIG.callback.onDomainClick(self.getNodeAttributes(node));
                    }
                }
            }

        });

        /* Show required domain. */
        this.tree.on('ready.jstree', function (data) {

            /* set and select default code. */
            self.selectDefaultCode();

            // options
            if (self.CONFIG.options) {
                if (self.CONFIG.options.open_all) {
                    // open all tree nodes
                    self.tree.jstree("open_all");
                }
            }

            /* Invoke onTreeRendered function. */
            if (self.CONFIG.callback.onTreeRendered) {

                // TODO: fix workaround for default code
                var node = self.tree.jstree().get_selected(true);

                if (node !== undefined && node.length > 0) {
                    self.CONFIG.callback.onTreeRendered(self.getNodeAttributes(node[0]));
                }
            }

        });

        // added search
        if ( this.CONFIG.placeholder_search !== null) {
            this.$search = $(this.CONFIG.placeholder_search).length > 0 ? $(this.CONFIG.placeholder_search) : $("#" + this.CONFIG.placeholder_search)

            this.$search.keyup(function (e) {
                setTimeout(function () {
                    self.tree.jstree(true).search(self.$search.val());
                }, 250);
            });

        }

    };

    TREE.prototype.selectDefaultCode = function () {
        if (this.CONFIG.code) {
            this.CONFIG.default_code = this.CONFIG.code;
        } else if (this.CONFIG.domain) {
            this.CONFIG.default_code = this.CONFIG.domain;
        } else if (this.CONFIG.group) {
            this.CONFIG.default_code = this.CONFIG.group;
        } else {
            // TODO: no default selection
        }

        if (this.CONFIG.default_code) {
            if ( this.tree) {
                try {
                    this.tree.jstree().select_node(this.CONFIG.default_code);
                    this.tree.jstree().open_node(this.CONFIG.default_code);
                }catch(e) {
                    log.error("TREE.selectDefaultCode;", e);
                }
            }
        }
    };

    TREE.prototype.getNodeAttributes = function (node) {

        // overriding the node attributes to in case add the label and/or text attributes on return
        if (!node.li_attr.hasOwnProperty('label')) {
            node.li_attr.label = node.text;
        }

        if (!node.li_attr.hasOwnProperty('text')) {
            node.li_attr.text = node.text;
        }

        return node.li_attr;

    };

    TREE.prototype.getCodeType = function () {
        var node = $('#' + this.tree.jstree('get_selected'));
        return this.tree.jstree().is_leaf(node) ? 'domain' : 'group';
    };

    TREE.prototype.destroy = function () {
        this.tree.jstree('destroy');
    };

    TREE.prototype.dispose = function () {
        this.destroy();
    };

    return TREE;

});