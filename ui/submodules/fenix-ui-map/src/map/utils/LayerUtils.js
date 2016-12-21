FM.LayerUtils = {

    setLayerOpacity: function(l, opacity) {
        if (l.leafletLayer) l.leafletLayer.setOpacity(opacity)
        l.layer.opacity = opacity;
    },

    filterLayerMinEqualThan:function(fenixMap, l, value) {
        l = FM.LayerUtils.getValuesMinEqualThan(l, value);
        l.redraw();
    },

    filterLayerGreaterEqualThan:function(fenixMap, l, value) {
        l = FM.LayerUtils.getValuesGreaterEqualThan(l, value);
        l.redraw();
    },

    filterLayerInBetweenEqualThan:function(fenixMap, l, min, max) {
        l = FM.LayerUtils.getValuesInBetweenEqualThan(l, min, max);
        l.redraw();
    },

    filterLayerOuterEqualThan:function(fenixMap, l, min, max) {
        l = FM.LayerUtils.getValuesOuterEqualThan(l, min, max);
        l.redraw();
    },

    getValuesMinEqualThan:function(l, value) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( v <= value)  {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    },
    getValuesGreaterEqualThan:function(l, value) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( v >= value)  {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    },

    getValuesInBetweenEqualThan:function(l, min, max) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( v >= min && v <= max)  {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    },

    getValuesOuterEqualThan:function(l, min, max) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( (min &&  v <= min) || (max &&  v >= max)) {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    }
}
