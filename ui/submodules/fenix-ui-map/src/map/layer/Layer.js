FM.Layer = FM.Class.extend({

    _fenixmap: '',

    id : '',

    //layer: '',

    layer: {
        // WMS default parameters
        styles:'', // could be better 'styles' to be passed directory to the WMS parameters
        srs : 'EPSG:3857',
        visibility: true, //enabled/disabled layer and also to the wms request
        format: "image/png", // ["image/png", "image/gif"]
        transparent: 'TRUE', //[TRUE, FALSE]
        opacity: 1,
        // Other Options
        name: '',
        title: '',
        abstract: '',
        srs: '',
        LatLonBoundingBox: '',
        BoundingBox: '',
        Style: {
            name: '',
            title: '',
            abstract: '',
            legendurl: {
                format: '',
                onlineresource: '' //differenct xml attributes (how to store it?
            }
        },
        KeywordList: [],

        layertitle: '',
        enablegfi: true,
        layertype: 'WMS', //['WMS', 'JOIN', 'TILE']
        openlegend: false,

        // JOIN default options
        switchjointype: false,

        // language
        lang: 'EN' //ISO2

    },

    leafletLayer: '',

    initialize: function(layer, options) { // (HTMLElement or String, Object)
        this.layer = $.extend(true, {}, this.layer, layer);

        if (options) {
            this.options = options;
        }

        // TODO: handle wrong zindex name
        if (this.layer.zindex) {
            this.layer.zIndex = this.layer.zindex;
        }

        //console.log("map - Layer.initialize", this.layer);

        this.id = FM.Util.randomID();

        if (layer.joindata) {
            layer.defaultdata = layer.joindata;
        }
    },

    createLayerWMS: function() {

        var wmsParameters = this._getWMSParameters();
        if ( this.leafletLayer ) {
            if(this.layertype === 'WMS') {
                this.leafletLayer.setParams(wmsParameters);
            }
        }
        else {
            wmsParameters = (this.options)? $.extend(true, {}, this.options, wmsParameters): wmsParameters;
            this.leafletLayer = new L.TileLayer.WMS( this.layer.urlWMS, wmsParameters );
        }
        this.leafletLayer.setZIndex(this.layer.zIndex);
        return this.leafletLayer;
    },

    createLayerWMSSLD: function() {
        var wmsParameters = this._getWMSParameters();
        if ( this.leafletLayer ) {
            this.leafletLayer.setParams(wmsParameters);
        }
        else {
            this.leafletLayer = new L.TileLayer.WMS( this.layer.urlWMS, wmsParameters );
        }
        this.leafletLayer.setZIndex(this.layer.zIndex);
        return this.leafletLayer;
    },

    /** TODO: make also the other parameters dynamic **/
    _getWMSParameters:function() {
        var options = {};

        options.id = this.id;

        // can be used layers (default WMS parameter or layername)
        options.layers = ( this.layer.name )?  this.layer.name: this.layer.layers;
        options.format= this.layer.format;
        options.transparent = this.layer.transparent.toUpperCase();
        options.visibility = this.layer.visibility;
        options.opacity = this.layer.opacity;

        /** TODO: handle additional parameters that are not default ones **/
        /** i.e. http://nyc.freemap.in/cgi-bin/mapserv?MAP=/www/freemap.in/nyc/map/basemap.map **/

        // check whether styles or style is set (styles is the default URL parameter)
        options.styles=this.layer.styles;
        if ( this.layer.style ) options.styles = this.layer.style;
        if ( this.layer.sldurl ) options.sld = this.layer.sldurl;
        if ( this.layer.cql_filter ) options.cql_filter = this.layer.cql_filter;
        if ( this.layer.sld_body ) options.sld_body = this.layer.sld_body;
        this.layer.layers = ( this.layer.layername )?  this.layer.layername: this.layer.layers;

        return options;
    },

    // this is just to use with the WMS Layers // check layer type
    redraw: function(fenixmap) {
        var l = this;
        if (l.layer.layertype ) {
            switch(l.layer.layertype ) {
                case 'JOIN':
                    if (l.layer.jointype.toLocaleUpperCase() == 'SHADED') {
                        if ( fenixmap ) fenixmap.addLayer(this);
                        else if ( this._fenixmap ) this._fenixmap.addLayer(this);
                    }
                    else if (l.layer.jointype.toLocaleUpperCase() == 'POINT')
                        console.log('TODO: handle redraw point');
                    break;
                case 'WMS':
                    this.createLayerWMS();
                    this.leafletLayer.redraw();
                    break;
                default:
                    this.createLayerWMS();
                    this.leafletLayer.redraw();
                    break;
            }
        }
    },

    /** TOODO: remove layer also from the layers list **/
    removeLayer: function(fenixmap) {
        /** TODO: remove it from the list **/
        if ( fenixmap )
            fenixmap.removeLayer(this);
        else if ( this._fenixmap)
            this._fenixmap.removeLayer(this);
    },

    /** shortcut **/
    addPointLayer: function(fenixmap) {
        if ( fenixmap )
            fenixmap.addPointLayer(this);
        else if ( this._fenixmap)
            this._fenixmap.addPointLayer(this);
    },

    addLayerWMS: function(fenixmap) {
        if ( fenixmap )
            fenixmap.addLayerWMS(this);
        else if ( this._fenixmap)
            this._fenixmap.addLayerWMS(this);
    },

    addLayer: function(fenixmap) {
        if ( fenixmap ) {
            fenixmap.addLayer(this);
        }
        else if ( this._fenixmap) {
            this._fenixmap.addLayer(this);
        }
    },

    addShadedLayer: function(fenixmap) {
        if ( fenixmap )
            fenixmap.addShadedLayer(this);
        else if ( this._fenixmap)
            this._fenixmap.addShadedLayer(this);
    }

});

FM.layer = function (layer, map, options) {
    return new FM.Layer(layer, map, options);
};


