FM.SpatialQuery = {

    /**
     *
     * Perform a GetFeautreInfo with a Joined Layer
     *
     * @param l
     * @param layerPoint
     * @param latlng
     * @param map
     */
    getFeatureInfoJoin: function(l, layerPoint, latlng, fenixmap) {
        // setting a custom popup if it's not available
        if (l.layer.customgfi == null ) FMDEFAULTLAYER.joinDefaultPopUp(l.layer)
        FM.SpatialQuery.getFeatureInfoStandard(l, layerPoint, latlng, fenixmap);
    },


    /**
     *
     * GetFeatureInfo standard (used to WMS GetFeatureInfoRequests)
     *
     * @param l
     * @param layerPoint
     * @param latlng
     * @param map
     */
    getFeatureInfoStandard: function(l, layerPoint, latlng, fenixmap) {

        // bind to leaflet map
        var map = fenixmap.map;

        // query parameters for the GFI
        var bounds = map.getBounds();
        var sw = map.options.crs.project(bounds.getSouthWest());
        var ne = map.options.crs.project(bounds.getNorthEast());
        var BBOX = (sw.x ) + ',' + (sw.y) +',' + (ne.x) + ',' + (ne.y);
        var WIDTH = map.getSize().x;
        var HEIGHT = map.getSize().y;
        var X = map.layerPointToContainerPoint(layerPoint).x;
        var Y = map.layerPointToContainerPoint(layerPoint).y;
        // TODO: check it because in theory it shouldn't be needed
        X = new Number(X);
        X = X.toFixed(0) //13.3714
        Y = new Number(Y);
        Y = Y.toFixed(0) //13.3714
        var url = fenixmap.options.url.MAP_SERVICE_GFI_STANDARD;
        //var url = FMCONFIG.BASEURL_MAPS  + FMCONFIG.MAP_SERVICE_GFI_STANDARD;
        url += '?SERVICE=WMS';
        url += '&VERSION=1.1.1';
        url += '&REQUEST=GetFeatureInfo';
        url += '&BBOX='+BBOX;
        url += '&HEIGHT='+HEIGHT;
        url += '&WIDTH='+WIDTH;
        url += '&X='+X;
        url += '&Y='+Y;
        url += '&FORMAT=image/png';
        url += '&INFO_FORMAT=text/html';

        // get the selected layer and layer values
        if ( l != '' && l != null ) {
            url += '&LAYERS=' + l.layer.layers;
            url += '&QUERY_LAYERS=' + l.layer.layers;
            url += '&STYLES=';
            // TODO: this should be loaded at runtime based on the projection used on the map?
            url += '&SRS=EPSG:3857';
            //l.layer.srs; //EPSG:3857
            url += '&urlWMS=' + l.layer.urlWMS;
            FM.SpatialQuery.getFeatureInfoJoinRequest(url, 'GET', latlng, map, l);
        }
        else {
            // alert('no layer selected')
        }
    },


    // TODO: use an isOnHover flag?
    getFeatureInfoJoinRequest: function(url, requestType, latlon, map, l) {
        var lang = l.layer.lang != null? l.layer.lang : map.options.lang;
        var _map = map;
        var _l = l;
        $.ajax({
            type: "GET",
            url: url,
            success: function(response) {
                // do something to response
                if ( response != null ) {
                    // rendering the output
                    var maxWidth = $('#' + _map._fenixMap.id).width() - 15;
                    var maxHeight = $('#' + _map._fenixMap.id).height() - 15;
                    var popup = new L.Popup({maxWidth: maxWidth, maxHeight: maxHeight});

                    /** TODO: do it MUCH nicer **/
                    var r = response;
                    if (_l.layer.customgfi) {
                        var joindata = _l.layer.joindata != null? _l.layer.joindata : _l.layer.data;
                        var result = FM.SpatialQuery.customPopup(response, _l.layer.customgfi, lang, joindata, l.layer);
                        // TODO: handle multiple outputs
                        r = (result != null) ? result[0] : response;
                    }
                    else {
                        var result = FM.SpatialQuery.transposeHTMLTable(response, _l.layer.layertitle);
                        r = (result != null) ? result[0] : response;
                    }

                    // check if the output is an empty (geoserver) output
                    r = FM.SpatialQuery._checkGeoserverDefaultEmptyOutput(r);

                    // how to handle custom callback
                    if (_l.layer.customgfi) {
                        if (_l.layer.customgfi && _l.layer.customgfi.callback) ( _l.layer.customgfi.callback(r, _l.layer) )
                        if (_l.layer.customgfi && _l.layer.customgfi.output && _l.layer.customgfi.output.show) {
                            $('#' + _l.layer.customgfi.output.id).empty();
                            if (r) {
                                $('#' + _l.layer.customgfi.output.id).append(r);
                            }
                        }
                        if (_l.layer.customgfi && _l.layer.customgfi.showpopup) {
                            if (r) {
                                popup.setLatLng(latlon).setContent(r);
                                _map.openPopup(popup);
                            }
                        }
                    }
                    else {
                        if (r) {
                            popup.setLatLng(latlon).setContent(r);
                            _map.openPopup(popup);
                        }
                    }
                }
            }
        });
    },

    customPopup: function(response, custompopup, lang, joindata, layer) {
        var values = this._parseHTML(custompopup.content[lang]);
        if ( values.id.length > 0 || values.joinid.length > 0) {
            var h = $('<div></div>').append(response);
            var responsetable = h.find('table');
            if ( responsetable) {
                return FM.SpatialQuery._customizePopUp(custompopup.content[lang], values, responsetable, joindata, layer );
            }
        }

    },

    /** TODO: how to check it?  **/
    _checkGeoserverDefaultEmptyOutput: function(response) {
        return response;
    },

    _customizePopUp:function(content, values, responsetable, joindata, layer) {

        var tableHTML = responsetable.find('tr');
        var headersHTML = $(tableHTML[0]).find('th');
        var rowsData = [];

        // get only useful headers
        var headersHTMLIndexs = [];
        for ( var i=0;  i < headersHTML.length; i ++) {
            for (var j=0; j< values.id.length; j++) {
                if (values.id[j].toUpperCase() == headersHTML[i].innerHTML.toUpperCase()) {
                    headersHTMLIndexs.push(i);
                    break;
                }
            }
        }

        // this is in case the joinid is not empty TODO: split the code
        if ( joindata ) {
            var headersHTMLJOINIndexs = [];
            for ( var i=0;  i < headersHTML.length; i ++) {
                for (var j=0; j< values.joinid.length; j++) {
                    if ( values.joinid[j].toUpperCase() == headersHTML[i].innerHTML.toUpperCase()) {
                        headersHTMLJOINIndexs.push(i); break;
                    }
                }
            }
        }

        // get rows data
        for(var i=1; i<tableHTML.length; i ++) {
            rowsData.push($(tableHTML[i]).find('td'))
        }

        // create the response results
        var htmlresult = [];
        for( var j=0; j < rowsData.length; j++) {

            // this is done for each row of result (They could be many rows)
            var c = content;

            // Replace IDs
            for(var i=0; i<headersHTMLIndexs.length; i ++) {
                var header = '{{' + headersHTML[headersHTMLIndexs[i]].innerHTML + '}}';
                var d = rowsData[j][headersHTMLIndexs[i]].innerHTML;
                c = FM.Util.replaceAll(c, header, d);
            }

            // Replace joindata (if needed)
            // used to add dynamically the measurementunit
            var checkJoinData = false;
            if ( joindata ) {
                for(var i=0; i<headersHTMLJOINIndexs.length; i ++) {
                    var header = '{{{' + headersHTML[headersHTMLJOINIndexs[i]].innerHTML + '}}}';
                    var d = rowsData[j][headersHTMLJOINIndexs[i]].innerHTML;
                    var v = FM.SpatialQuery._getJoinValueFromCode(d, joindata);
                    v = (v !== 'NA' && layer.decimalvalues)? v.toFixed(layer.decimalvalues): v;
                    c = FM.Util.replaceAll(c, header, v);
                    if (v !== 'NA') {
                        checkJoinData = true;
                    }
                }
            }

            // adding the row result to the outputcontent
            htmlresult.push(c)
        }

        // "dynamic" measurementunit change
        htmlresult[0] = FM.Util.replaceAll(htmlresult[0], "{{measurementunit}}", (checkJoinData)? layer.measurementunit: '');

        return htmlresult;
    },


    _getJoinValueFromCode: function(code, joindata) {
        //TODO: do it nicer: the problem on the gaul is that the code is a DOUBLE and in most cases it uses an INTEGER
        var integerCode = ( parseInt(code) )? parseInt(code): null
        //console.log(integerCode);
        var json = ( typeof joindata == 'string' )? $.parseJSON(joindata) : joindata;
        for(var i=0; i< json.length; i++) {
            if ( json[i][code] || json[i][integerCode] ) {
                if ( json[i][code] ) {
                    //console.log( json[i][code]);
                    return json[i][code];
                }
                else {
                    //console.log( json[i][integerCode]);
                    return json[i][integerCode];
                }
            }
        }
        return 'NA';
        //return 'No data available for this point';
    },

    /**
     *
     * Get all {{value}}
     * @private
     */
    _parseHTML: function(content) {
        var values = {};
        values.id = [];
        values.joinid = [];

        //console.log(content);
        var array = content.match(/\{\{.*?\}\}/g);
        for (var i=0; i < array.length; i++) {
            array[i] = FM.Util.replaceAll(array[i], "{{", "");
            array[i] = FM.Util.replaceAll(array[i], "}}", "");

            // if it contains $ (this means that is a joinid
            if ( array[i].indexOf('{') >= 0 ) {
                array[i] = FM.Util.replaceAll(array[i], "{", "");
                array[i] = FM.Util.replaceAll(array[i], "}", "");
                values.joinid.push(array[i]);
            }
            else {
                values.id.push(array[i]);
            }
        }
        return values;
    },

    transposeHTMLTable: function(response, layertitle){
        /** TODO: make it nicer **/
        var h = $('<div></div>').append(response);
        var table = h.find('table');
        var result = [];
        if ( table ) {
            var r = FM.SpatialQuery.transposeHTML(table, layertitle);
            if ( r != null ) return r;
        }
        return null;
    },

    transposeHTML:function(table, layertitle) {
        var div = $('<div class="fm-transpose-popup"></div>');
        var titleHTML = table.find('caption');
        try {
            div.append(layertitle)

            var tableHTML = table.find('tr');

            var headers = $(tableHTML[0]).find('th');
            var rowsData = [];
            for ( var i =1;  i < tableHTML.length; i ++) {
                rowsData.push($(tableHTML[i]).find('td'))
            }

            var t = $('<table></table>');
            var tb = $('<tbody></tbody>');
            for( var i =0; i < headers.length; i++) {
                var tr = '<tr>';
                var td = '<td>' + headers[i].innerHTML + '</td>';
                for(var j = 0; j < rowsData.length; j++) {
                    td += '<td>' +rowsData[j][i].innerHTML + '</td>';
                }
                tr += td;
                tr += '</tr>';
                tb.append(tr);
            }
            return div.append(t.append(tb));
        } catch (e) {
            return null;
        }
    },

    filterLayerMinEqualThan: function(l, value) {
        FM.LayerUtils.filterLayerMinEqualThan(this, l, value);
    },

    filterLayerGreaterEqualThan:function(l, value) {
        FM.LayerUtils.filterLayerGreaterEqualThan(this, l, value);
    },

    filterLayerInBetweenEqualThan:function(l, min, max) {
        FM.LayerUtils.filterLayerInBetweenEqualThan(this, l, min, max);
    },

    filterLayerOuterEqualThan:function(l, min, max) {
        FM.LayerUtils.filterLayerOuterEqualThan(this, l, min, max);
    }

}
