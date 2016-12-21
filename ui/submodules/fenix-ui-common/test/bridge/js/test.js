/*global requirejs, define*/
define([
    'loglevel',
    'fx-common/bridge',
    'underscore'
], function (log, Bridge, _) {

    'use strict';

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._cacheKeyTest();

    };

    Test.prototype._cacheKeyTest = function () {

        var obj1 = {
            param: "dani"
        }, obj2 = {
            param: {
                name: "dani"
            }
        }, obj3 = {
            param: {
                name: "dani",
                city: "Rome"
            }
        }, obj4 = {
            param: {
                name: "dani",
                city: "Rome",
                nested: {
                    param: true
                }
            }
        }, hashes = [],
            isValid = true;

        if (Bridge.getCacheKey(obj1) !== Bridge.getCacheKey(obj1)) {
            log.error("Same object hash is not equal");
            isValid = false;
        }

        if (Bridge.getCacheKey(obj4) !== Bridge.getCacheKey(obj4)) {
            log.error("Same object hash is not equal");
            isValid = false;
        }

        hashes.push(Bridge.getCacheKey(obj1));
        hashes.push(Bridge.getCacheKey(obj2));
        hashes.push(Bridge.getCacheKey(obj3));
        hashes.push(Bridge.getCacheKey(obj4));

        if ( _.uniq(hashes, JSON.stringify).length !== hashes.length) {
            log.error("Different objects have same hash");

            _.each(hashes, function (hash) {
                log.error(JSON.stringify(hash))
            });
            isValid = false;
        }

        isValid ?
            log.warn("End hash test. Everything is under control!") :
            log.error("End hash test. Check error above");

    };

    return new Test();
});
