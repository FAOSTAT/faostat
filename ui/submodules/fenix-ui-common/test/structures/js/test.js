/*global requirejs, define*/
define([
    'loglevel',
    'fx-common/structures/fx-fluid-grid',
    'text!test/html/templates.hbs'
], function (log, Grid, Template) {

    'use strict';

    var s = {
        GRID : "#grid"
    };

    function Test() { }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._initGrid();

        this._bindEventListeners();

    };

    Test.prototype._initGrid = function () {

        this.grid = new Grid({
            $el : s.GRID
        });


    };

    Test.prototype._bindEventListeners = function () {

        var self = this;

       $("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action");

            $this.on("click", {action: action}, function (e) {

                e.preventDefault();

                self['_action_' + action].call(self);

            });
        });
    };

    Test.prototype._createItem = function () {

        var self = this,
            $item = this.grid.getBlankContainer();

            $item.html($(Template));

        $item.find('button').on("click", function () {
            var $this = $(this);

            self.grid.remove($this.closest('[data-role="fx-grid-item"]'));
        });

        return $item;
    };

    Test.prototype._action_add = function () {
        log.info("action");

        this.grid.add(this._createItem());
    };

    Test.prototype._action_reset = function () {
        log.info("Reset action");

        this.grid.reset();
    };

    return new Test();
});
