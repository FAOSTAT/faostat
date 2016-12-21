/*global define, amplify */
define([
    'jquery',
    'fx-ds/itemRenders/chartItem',
    'fx-ds/itemRenders/mapItem',
    'fx-ds/itemRenders/tableItem',
    'fx-ds/itemRenders/customItem',
    'amplify',
    'bootstrap'
], function ($, ChartItem, MapItem, TableItem, CustomItem) {

    'use strict';

    var defaultOptions = {

    };

    function Factory(options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        this.renders = {};

        this.renders.CHART = ChartItem;

        this.renders.MAP = MapItem;

        this.renders.TABLE = TableItem;

        this.renders.CUSTOM = CustomItem;

        this.bindEventListeners();
    }

    Factory.prototype.bindEventListeners = function () {

    };

    Factory.prototype.getItemRender = function ( item ) {

        var type = item.type || '';

        switch (type.toLocaleLowerCase()){
            case 'chart' :
                return new this.renders.CHART(item);
                break;
            case 'map' :
                return new this.renders.MAP(item);
                break;
            case 'table' :
                return new this.renders.TABLE(item);
                break;
            case 'custom' :
                return new this.renders.CUSTOM(item);
                break;
        }

    };

    return Factory;
});