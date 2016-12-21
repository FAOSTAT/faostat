FM.WCS = function() {

    // TODO: config are the map.config (to be passed)
    var config = {
        url: {}
    }

    // PROXY used to load the requests
    var PROXY = (config.url.MAP_SERVICE_PROXY)? config.url.MAP_SERVICE_PROXY: 'http://fenixapps2.fao.org/maps/rest/service/request'

    // current version
    var VERSION = '1.1.1';

    // this variable is used to manage the WFS Version in 2.0 typeName became typeNames
    var IDENTIFIERS = {
        '1.1.1' : 'identifiers',
        '2.0'   : 'identifiers'
    }

    /**
     * Return the description of the columns
     * @param obj
     * @param callback call back function
     * var obj = {url: '', layername: '', version: '' // in case it's not 1.1.0'}
     */
    var getDescription = function(obj, callback) {
        var request = PROXY;
        request += '?service=wcs';
        request += ( obj.version )? '&version=' + obj.version: '&version=' + VERSION;
        request += '&request=DescribeCoverage';
        request += '&' + IDENTIFIERS[VERSION] +'=' + obj.layername;
        request += '&urlWMS=' + obj.url; //TODO: on the service change name to refrect just a url and not urlWMS
        $.ajax({
            type: 'GET',
            url: request,
            success: function(response) { parseXML(response, callback) },
            error: function() { console.log('WCS error getDescription() REQUEST'); }
        });
    }

    var parseXML = function(xml, callback) {
        var result = 'TODO: parse XML if there are useful information'
        if ( callback) callback(result)
    }

    return {
        getDescription: getDescription,
        getVersion: function() { return VERSION }
    }
}();

