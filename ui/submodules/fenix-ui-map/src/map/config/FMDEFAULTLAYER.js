FMDEFAULTLAYER = {

    getLayer: function(layertype, isjoin, measurementunit) {
        switch(layertype.toUpperCase()) {
            case "GAUL0"                : return FMDEFAULTLAYER._getGAUL('gaul0_faostat_3857_2', 'adm0_code', 'the_geom', isjoin, 'faost_n', measurementunit, 'GAUL'); break;
            case "GAUL0_FAOSTAT"        : return FMDEFAULTLAYER._getGAUL('gaul0_faostat_3857', 'faost_code','the_geom', isjoin, 'faost_n', measurementunit, 'FAOSTAT'); break;
            case "GAUL0_ISO2"           : return FMDEFAULTLAYER._getGAUL('gaul0_faostat_3857_2', 'iso2_code', 'the_geom', isjoin, 'faost_n', measurementunit, 'ISO2'); break;
            case "GAUL0_ISO3"           : return FMDEFAULTLAYER._getGAUL('gaul0_faostat_3857_2', 'iso3_code', 'the_geom', isjoin, 'faost_n', measurementunit, 'ISO3'); break;
            case "GAUL0_BOUNDARIES"     : return FMDEFAULTLAYER._getWMSLayer('gaul0_line_3857'); break;
            case "GAUL1"                : return FMDEFAULTLAYER._getGAUL('gaul1_3857', 'adm1_code', 'the_geom', isjoin, 'adm1_name', measurementunit, null); break;
//            case "GAUL1"                : return FMDEFAULTLAYER._getGAUL('gaul1_3857', 'adm1_code', 'the_geom', isjoin, 'adm1_name', measurementunit, null); break;
//            case "GAUL2"                : return FMDEFAULTLAYER._getGAUL('gaul2_3857', 'adm2_code', 'the_geom', isjoin, 'adm2_name', measurementunit, null); break;
            // TODO: change to a standard GAUL2 layer. 'gaul2_3857_2'is another GAUL2 used with the new popup (the old gaul2 as content.ftl used by countrystat)
            case "GAUL2"                : return FMDEFAULTLAYER._getGAUL('gaul2_3857', 'adm2_code', 'the_geom', isjoin, 'adm2_name', measurementunit, null); break;
        }
    },

    _getGAUL: function(layername, joincolumn, geometrycolumn, isjoin, joincolumnlabel, measurementunit, joinboundary) {
        var layer = {};
        layer.layers=layername ;
        layer.styles='';
        layer.joincolumn=(joincolumn )? joincolumn: null;
        layer.joincolumnlabel=(joincolumnlabel )? joincolumnlabel: null;
        layer.measurementunit=(measurementunit )? measurementunit: null;
        layer.srs = 'EPSG:3857';
        layer.geometrycolumn =(geometrycolumn )? geometrycolumn: '';
        if (isjoin) {
            FMDEFAULTLAYER.joinDefaultPopUp(layer);
            layer.joinboundary = joinboundary;
        }
        return layer;
    },

    _getWMSLayer:function(layername, urlWMS, styles, srs) {
        // TODO: remove FMCONFIG from here!
        var layer = {};
        layer.layers = layername;
        layer.styles = (styles)?styles:'';
        layer.srs = (srs)?srs:'EPSG:3857';
        layer.urlWMS = (urlWMS)?urlWMS: FMCONFIG.DEFAULT_WMS_SERVER;
        return layer;
    },

    /** TODO: handle multilanguage **/
    joinDefaultPopUp: function( layer ) {
        //console.log(layer);
        var measurementunit  = (layer.measurementunit)? " " + layer.measurementunit +"": "";
        var joinlabel  = (layer.joincolumnlabel)? "<div class='fm-popup-join-title'>{{" + layer.joincolumnlabel +"}}</div>": "";
        layer.customgfi = {
            content : {
                en: "<div class='fm-popup'>" + joinlabel + "<div class='fm-popup-join-content'>{{{" + layer.joincolumn +"}}} <i>" + measurementunit +"</i></div></div>",
                fr: "<div class='fm-popup'>" + joinlabel + "{{{" + layer.joincolumn +"}}} <i>" + measurementunit +"</i></div>",
                es: "<div class='fm-popup'>" + joinlabel + "{{{" + layer.joincolumn +"}}} <i>" + measurementunit +"</i></div>"
            }
            ,showpopup: true
            ,output: {
                show: true,
                id: 'gfiid'
            }
            ,callback : function(response, custompopup) {
                $('#' + custompopup.outputid ).empty();
                $('#' + custompopup.outputid ).append(response);
            }
        }
    }

};
