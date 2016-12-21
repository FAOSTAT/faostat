FM.WFS = function(config) {

    // TODO: config are the map.config (to be passed)
    var config = {
        url: {}
    }

    // PROXY used to load the requests
    var PROXY = (config.url.BASEURL_MAPS)? config.url.MAP_SERVICE_PROXY: 'http://fenixapps2.fao.org/maps/rest/service/request'

    // current WFS version
    var VERSION = '1.1.0';

    // this variable is used to manage the WFS Version in 2.0 typeName became typeNames
    var TYPENAME = {
        '1.1.0' : 'typeName',
        '2.0'   : 'typeNames'
    }

    /**
     * Return the description of the columns
     * @param obj
     * @param callback call back function
     * var obj = {url: '', layername: '', version: '' // in case it's not 1.1.0'}
     */
    var getFields = function(obj, callback) {
        var request = PROXY;
        request += '?SERVICE=WFS';
        request += (obj.version)? '&VERSION=' + obj.version: '&VERSION=' + VERSION;
        request += '&request=DescribeFeatureType';
        request += '&' + TYPENAME[VERSION] +'=' + obj.layername;
        request += '&urlWMS=' + obj.url; //TODO: on the service change name to refrect just a url and not urlWMS
        $.ajax({
            type: 'GET',
            url: request,
            success: function(response) { parseXML(response, callback) },
            error: function() { console.log('WFS error getDescription() REQUEST'); }
        });
    }

    var parseXML = function(xml, callback) {
        var xmlResponse = $.parseXML(xml), $xml = $( xmlResponse );
        var result = []
        $xml.find('xsd\\:sequence xsd\\:element').each(function() {
            // creating the json with the names and type of the fields
            result.push({ name: $(this).attr('name'), type: $(this).attr('type')} )
        });
        if ( callback)
            callback(result)
    }

    /**
     * Return the description of the columns
     * @param obj
     * @param callback call back function
     * var obj = {url: '', layername: '', propertyname: '' //attribute1,attribute2, sortby: '' // attribute+D attribute+A, version: '' // in case it's not 1.1.0' }
     */
    //http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName=fenix:gaul1_3857_2&propertyName=adm0_code,faost_n&sortBy=faost_n
    var getFieldsValues = function(obj, callback) {
        var request = PROXY;
        request += '?SERVICE=WFS';
        request += (obj.version)? '&VERSION=' + obj.version: '&VERSION=' + VERSION;
        request += '&request=GetFeature';
        request += '&' + TYPENAME[VERSION] +'=' + obj.layername;
        request += (obj.propertyname)? '&propertyname=' + obj.propertyname: '';
        request += (obj.sortby)? '&sortby=' + obj.sortby: '';
        request += '&outputFormat=json';
        request += '&urlWMS=' + obj.url; //TODO: on the service change name to refrect just a url and not urlWMS
        $.ajax({
            type: 'GET',
            url: request,
            success: function(response) { if(callback) callback(response) },
            error: function() { console.log('WFS error getDescription() REQUEST');  }
        });
    }

    var getFieldValueMin = function(obj, callback) {}
    var getFieldValueMax = function(obj, callback) {}

    return {
        getFields: getFields,
        getFieldsValues: getFieldsValues,
        getVersion: function() { return VERSION }
    }
}();

