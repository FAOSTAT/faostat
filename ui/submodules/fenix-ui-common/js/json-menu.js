define([
        'jquery',
        'bootstrap'
    ],
    function ($) {

        'use strict';

        function Menu(o) {

            this.$el = $(o.el);

            if (this.$el.length < 1) {
                alert("Impossible to find menu container");
            }

            if (!o.model) {
                alert("Impossible to find menu model");
            }

            var $ul = $("<ul class='dropdown-menu json-menu'></ul>");

            this.$el.append($ul);

            this._buildUL($ul, this._buildData(o.model));

            this._addBootstrapClass();

        }

        Menu.prototype._buildData = function (data) {

            var source = [],
                items = [],
                item;

            for (var i = 0; i < data.length; i++) {
                item = data[i];
                var label = item["label"];
                var parentid = item["parent_id"];
                var id = item["id"];
                var url = item["url"];
                var action = item["action"];
                var a_attrs = item["a_attrs"];

                if (items[parentid]) {
                    item = {parentid: parentid, label: label, url: url, item: item, action: action, a_attrs: a_attrs};
                    if (!items[parentid].items) {
                        items[parentid].items = [];
                    }
                    items[parentid].items[items[parentid].items.length] = item;
                    items[id] = item;
                }
                else {
                    items[id] = {
                        parentid: parentid,
                        label: label,
                        url: url,
                        item: item,
                        action: action,
                        a_attrs: a_attrs
                    };
                    source[id] = items[id];
                }
            }
            return source;
        };

        Menu.prototype._buildUL = function (parent, items) {

            $.each(items, $.proxy(function (index, item) {

                if (item && item.label) {
                    var li = $("<li class='js-menu'>" + "<a href='" + item.url + "'>" + item.label + "</a></li>");

                    if (item.a_attrs) {

                        for (var attr in item.a_attrs) {
                            if (item.a_attrs.hasOwnProperty(attr)) {
                                li.find("a").attr(attr, item.a_attrs[attr]);
                            }
                        }
                    }

                    li.appendTo(parent);

                    if (item.items && item.items.length > 0) {
                        var ul = $("<ul class='dropdown-menu js-menu'></ul>");
                        ul.appendTo(li);
                        this._buildUL(ul, item.items);
                    }
                }
            }, this));
        };

        Menu.prototype._addBootstrapClass = function () {

            //add bootstrap classes
            this.$el.find(".json-menu>li:has(ul.js-menu)").addClass('dropdown-submenu');

            /*
            if (this.$el.find(".json-menu>li:has(ul.js-menu)")) {
                //this.$el.find(".json-menu>li.js-menu").addClass('dropdown-submenu');
            }
            */

            if (this.$el.find(".json-menu>li>ul.js-menu>li:has(> ul.js-menu)")) {
                this.$el.find(".json-menu>li>ul.js-menu li ").addClass('dropdown-submenu');
            }

            this.$el.find("ul.js-menu").find("li:not(:has(> ul.js-menu))").removeClass("dropdown-submenu");

        };

        Menu.prototype.showItem = function (item) {

            var $item = this.$el.find("[data-tab='"+item+"']");

            $item.removeClass("hidden");

        };

        Menu.prototype.hideItem = function (item) {

            var $item = this.$el.find("[data-tab='"+item+"']");

            $item.addClass("hidden");

        };

        Menu.prototype.disableItem = function (item) {

            var $item = this.$el.find("[data-selector='"+item+"']").parent();

            $item.addClass("disabled");

        };

        Menu.prototype.enableItem = function (item) {

            var $item = this.$el.find("[data-selector='"+item+"']").parent();

            $item.removeClass("disabled");

        };

        return Menu;

    });