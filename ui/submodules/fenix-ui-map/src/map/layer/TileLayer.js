
FM.TileLayer = FM.Layer.extend({

  createTileLayer: function() {
    
    var info = this.layer.layername ? FM.TILELAYER[this.layer.layername] : FM.TILELAYER[this.layer.layers];

    this.layer.layertype = 'TILE';
    this.layer.layertitle = info[ 'title_' + this.layer.lang.toLowerCase() ];
    var leafletLayer = new L.TileLayer( info.url );
    return leafletLayer;
  }

});

FM.TileLayer.createBaseLayer = function (layername, lang) {
    var layer = {};
    // this is replicated because in wms it's used "layers" instead of layername
    layer.layername = layername;
    layer.layers = layername;
    layer.layertype = 'TILE';
    layer.lang = lang;
    var l = new FM.TileLayer(layer);
    l.leafletLayer = l.createTileLayer(layer.layername);
    return l;
};

// TODO: create a method to import an dependencies baselayer