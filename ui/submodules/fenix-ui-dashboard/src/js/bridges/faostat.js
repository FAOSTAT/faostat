/*global define, amplify */

define([
    "jquery",
    'fx-ds/config/config',
    'fx-ds/config/config-default',
    'fx-ds/config/events',
    'fx-ds/config/errors',
    //'fx-ds/config/d3p_filters',
    //'faostatclientAPI',
    'faostatapiclient',
    'loglevel',
    "amplify"
], function ($, C, DC, E, Err, API, log) {

    'use strict';

    var defaultOptions = {

        //requestType: "databean" // data/rankings
        requestType: "data" // data/rankings

    };

    function FAOSTAT_bridge(options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        return this;
    }

    FAOSTAT_bridge.prototype.query = function (filter) {

        var requestType = (this.o.bridge)? (this.o.bridge.requestType || this.o.requestType): this.o.requestType;

        if ( typeof API[requestType] === 'function') {
            //log.info("DS.FAOSTAT_bridge.query; filter", filter);
            return API[requestType](filter);
        }
        else {
            log.error(requestType + " not present in faostatAPI");
            throw new Error(requestType + " not present in faostatAPI");
        }

    };

    return FAOSTAT_bridge;

});