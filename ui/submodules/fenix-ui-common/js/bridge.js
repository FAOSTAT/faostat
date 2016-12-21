/*global define*/
define([
    'fx-common/config/errors',
    'fx-common/config/events',
    'fx-common/config/config',
    'fx-common/config/config-default',
    'jquery',
    'underscore',
    'q',
    'loglevel',
    'object-hash',
    'amplify'
], function (ERR, EVT, C, DC, $, _, Q, log, Hash) {

    'use strict';

    function Bridge() {
        this.cache = {};
    }

    Bridge.prototype.find = function (obj) {

        var key = $.extend(true, {
                type: "find"
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.SERVICE_PROVIDER || C.SERVICE_PROVIDER || DC.SERVICE_PROVIDER,
            filterService = obj.FIND_SERVICE || C.FIND_SERVICE || DC.FIND_SERVICE,
            body = obj.body;

        return Q($.ajax({
            url: serviceProvider + filterService + this._parseQueryParams(obj.params),
            type: obj.type || "POST",
            contentType: obj.dataType || "application/json",
            data: JSON.stringify(body),
            dataType: obj.dataType || 'json'
        })).then(function (data) {

            self._setCacheItem(key, data);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    Bridge.prototype.getEnumeration = function (obj) {

        var key = $.extend(true, {
                type: "enumeration"
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || C.SERVICE_PROVIDER || DC.SERVICE_PROVIDER,
            enumerationService = obj.enumerationService || C.ENUMERATION_SERVICE || DC.ENUMERATION_SERVICE;

        return Q($.ajax({
            url: serviceProvider + enumerationService + obj.uid,
            type: obj.type || "GET",
            dataType: obj.dataType || 'json'
        })).then(function (data) {

            self._setCacheItem(key, data);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    Bridge.prototype.getCodeList = function (obj) {

        var key = $.extend(true, {
                type: "codelist"
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || C.SERVICE_PROVIDER || DC.SERVICE_PROVIDER,
            codeListService = obj.codeListService || C.CODELIST_SERVICE || DC.CODELIST_SERVICE,
            body = obj.body;

        return Q($.ajax({
            url: serviceProvider + codeListService + this._parseQueryParams(obj.params),
            type: obj.type || "POST",
            dataType: obj.dataType || 'json',
            contentType: obj.contentType || "application/json",
            data: JSON.stringify(body)
        })).then(function (data) {

            self._setCacheItem(key, data);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });

    };

    Bridge.prototype.getResource = function (obj) {

        var key = $.extend(true, {
                type: "resource"
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || C.SERVICE_PROVIDER || DC.SERVICE_PROVIDER,
            processesService = obj.processesService || C.PROCESSES_SERVICE || DC.PROCESSES_SERVICE;

        return Q($.ajax({
            url: serviceProvider + processesService + this._parseUidAndVersion(obj) + this._parseQueryParams(obj.params),
            type: obj.type || "POST",
            dataType: obj.dataType || 'json',
            contentType: obj.contentType || "application/json",
            data: JSON.stringify(obj.body)
        })).then(function (data) {

            self._setCacheItem(key, data);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    Bridge.prototype.getMetadata = function (obj) {

        var key = $.extend(true, {
                type: "metadata"
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || C.SERVICE_PROVIDER || DC.SERVICE_PROVIDER,
            processesService = obj.metadataService || C.METADATA_SERVICE || DC.METADATA_SERVICE;

        return Q($.ajax({
            url: serviceProvider + processesService + this._parseUidAndVersion(obj, true) + this._parseQueryParams(obj.params),
            type: obj.type || "GET",
            dataType: obj.dataType || 'json'
        })).then(function (data) {

            self._setCacheItem(key, data);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });

    };

    Bridge.prototype.all = function (promises) {

        return Q.all(promises);
    };

    Bridge.prototype.getCacheKey = function (obj) {

        return this._getCacheKey(obj);
    };

    Bridge.prototype._parseQueryParams = function (params) {

        if (!params) {
            return '';
        }

        var result = '?';

        _.each(params, function (value, key) {
            result += key + '=' + value + '&'
        });

        return result.substring(0, result.length - 1);

    };

    Bridge.prototype._parseUidAndVersion = function (params, appendUid) {

        var result = '',
            versionFound = false;

        if (!params.uid) {
            log.warn("Impossible to find uid")
        }

        result = result.concat(params.uid);

        if (params.version) {
            result = result.concat("/").concat(params.version);
            versionFound = true
        }

        return (appendUid === true && versionFound !== true) ? 'uid/' + result : result;

    };

    Bridge.prototype._setCacheItem = function (key, value) {

        try {
            amplify.store.sessionStorage(this.getCacheKey(key), value)
        } catch (e) {

            this.cache[key] = value;
        }

        return this._getCacheItem(key);
    };

    Bridge.prototype._getCacheItem = function (key) {

        var item = amplify.store.sessionStorage(this.getCacheKey(key));

        return item ? item : this.cache[key];

    };

    Bridge.prototype._getCacheKey = function (obj) {

        var key = Hash(obj);

        return key;

    };

    return new Bridge();

});