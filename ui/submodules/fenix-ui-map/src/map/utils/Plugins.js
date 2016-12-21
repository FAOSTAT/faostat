FM.Plugins = {

    _addzoomcontrol: function(_fenixmap, show) {
    	if( show ) {
	    	var pos = typeof _fenixmap.options.plugins.zoomcontrol === 'string' ? 
							_fenixmap.options.plugins.zoomcontrol : 'bottomright';
	        return new L.Control.Zoom({position: pos}).addTo(_fenixmap.map);
       	}
    },

    _addfullscreen: function(_fenixmap, show) {
        if ( show && window.fullScreenApi && window.fullScreenApi.supportsFullScreen) {
			return (function() {

                //TODO second click on button exit from fullscreen

				var zoompos = typeof _fenixmap.options.plugins.zoomcontrol === 'string' ? 
						_fenixmap.options.plugins.zoomcontrol : 'bottomright',
					pos = typeof _fenixmap.options.plugins.fullscreen === 'string' ? 
						_fenixmap.options.plugins.fullscreen : zoompos,
					control = new L.Control({position: pos});

				control.onAdd = function(map) {
					var div = L.DomUtil.create('div','leaflet-control-fullscreen fm-icon-box-background'),
						a = L.DomUtil.create('a','fm-icon-sprite fm-btn-icon', div);
					L.DomEvent
						.disableClickPropagation(a)
						.addListener(a, 'click', function() {

							var idDiv = _fenixmap.options.plugins.fullscreen.id || _fenixmap.id,
                                mapdiv = document.getElementById(idDiv);

                            if( window.fullScreenApi.isFullScreen(mapdiv) )
                                window.fullScreenApi.cancelFullScreen(mapdiv);
                            else
                                window.fullScreenApi.requestFullScreen(mapdiv);
						}, a);
					return div;
				};
				return control;
			}())
			.addTo(_fenixmap.map);
        }
    },

    _addzoomresetcontrol: function( _fenixmap, show) {
    	if( show ) {
			return (function() {
				var zoompos = typeof _fenixmap.options.plugins.zoomcontrol === 'string' ? 
						_fenixmap.options.plugins.zoomcontrol : 'bottomright',
					pos = typeof _fenixmap.options.plugins.zoomresetcontrol === 'string' ? 
						_fenixmap.options.plugins.zoomresetcontrol : zoompos,
					control = new L.Control({position: pos}),
					container = _fenixmap.plugins.zoomcontrol._container;

				control.onAdd = function(map) {
						var a = L.DomUtil.create('div','leaflet-control-zoom-reset',container);
						a.innerHTML = "&nbsp;";
						a.title = "Zoom Reset";
						L.DomEvent
							.disableClickPropagation(a)
							.addListener(a, 'click', function() {
								map.setView(map.options.center, map.options.zoom);
							},a);
						var d=  L.DomUtil.create('span');
						d.style.display = 'none';
						return d;
					};
				return control;
			}())
			.addTo(_fenixmap.map);
		}    	
    },

    _adddisclaimerfao: function(_fenixmap, show) {
        if ( show && $.powerTip) {
			return (function() {
				var pos = typeof _fenixmap.options.plugins.disclaimerfao === 'string' ? 
                        _fenixmap.options.plugins.disclaimerfao : 'bottomright',
					control = new L.Control({position: pos}),
					lang = _fenixmap.options.lang.toLowerCase();

				control.onAdd = function(map) {
						var div = L.DomUtil.create('div','leaflet-control-disclaimer fm-icon-box-background'),					
							a = L.DomUtil.create('a','fm-icon-sprite fm-icon-info', div);
						
						a.title = FM.guiMap['disclaimerfao_'+lang];
						
						$(a).powerTip({placement: 'nw'});

						return div;
					};
				return control;
			}())
			.addTo(_fenixmap.map);
        }
    },

    _addlayercontroller: function(_fenixmap, show){
        if ( show )
            $("#" + this.suffix +"-controller").show();
        else
            $("#" + this.suffix +"-controller").hide();
    },

    _addgeosearch: function(_fenixmap, show) {
        if ( show && L.GeoSearch) {
            return new L.Control.GeoSearch({
                provider: new L.GeoSearch.Provider.OpenStreetMap()
            }).addTo(_fenixmap.map);
        }
    },

    _addgeocoder: function(_fenixmap, show) {
        // TODO: should be load here dinamically the requires JS
        if ( show && L.Control.OSMGeocoder) {
            return new L.Conpluginstrol.OSMGeocoder().addTo(_fenixmap.map);
        }
    },

    _addmouseposition: function(_fenixmap, show) {
        if ( show && L.control.mousePosition) {
        	L.control.mousePosition().addTo(_fenixmap.map);
        }
    },

    _addexport: function(_fenixmap, show) {
        if ( show && L.Control.Export) {
        	_fenixmap.map.addControl(new L.Control.Export())
        }
    },

    _addprintmodule: function(_fenixmap, show) {
        if ( show && L.print)
            /** TODO: install print module **/
            var printProvider = L.print.provider({
                method: 'GET',
                url: 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/pdf',
                autoLoad: true,
                dpi: 254
            });
        var printControl = L.control.print({ provider: printProvider });
        _fenixmap.map.addControl(printControl);
    },

    /**
     *
     *
     * TODO: handle the layer control on layer selection to make spatial query
     *
     * (i.e. if a layer has certain properties add the draw control and remove it when is deselected )
     *
     *
     **/
    _adddrawcontrol: function(_fenixmap, show) {
        if ( show && L.Control.Draw) {

            var drawnItems = new L.FeatureGroup();
            _fenixmap.map.addLayer(drawnItems);

            var drawControl = new L.Control.Draw({
                draw: {
                    position: 'topleft',
                    polygon: {
                        title: 'Draw a polygon!',
                        allowIntersection: false,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    }
                },
                edit: {
                    featureGroup: drawnItems
                }
            });
            _fenixmap.map.addControl(drawControl);

            _fenixmap.map.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;

                if (type === 'marker') {

                    layer.bindPopup('A popup!');
                    //console.log(layer.getLatLng());
                    //console.log(_fenixmap.map.options.crs.project(layer.getLatLng()));
                }
                //console.log("created " + e.layerType);
                l = layer;
                l.layerType = type;
                drawnItems.addLayer(layer);

                _fenixmap.spatialQuery(layer)

            });

            _fenixmap.map.on('draw:edited', function (e) {
                var layers = e.layers;
                var countOfEditedLayers = 0;
                layers.eachLayer(function(layer) {
                    countOfEditedLayers++;
                });
            });
        }
    },

    _addcontrolloading: function( _fenixmap, show) {
        if ( show && L.Control.loading) {
            var loadingControl = L.Control.loading({
                separate: true,
                position: 'topright'
            });
            _fenixmap.map.addControl(loadingControl)
        }
    },

    _addscalecontrol: function( _fenixmap, show) {
        if( show && L.Control.Scale) {
            var pos = typeof _fenixmap.options.plugins.scalecontrol === 'string' ? 
                    _fenixmap.options.plugins.scalecontrol : 'topleft';
            
            L.control.scale({position: pos}).addTo(_fenixmap.map);
        }
    },

    _addlegendcontrol: function( _fenixmap, show) {
        if( show ) {
            return (function() {
                var pos = typeof _fenixmap.options.plugins.legendcontrol === 'string' ? 
                        _fenixmap.options.plugins.legendcontrol : 'topright',
                    control = new L.Control({position: pos});

                control.onAdd = function(map) {
                    var div = L.DomUtil.create('div','leaflet-control-legend');
                    //FILLED BY JQUERY
                    return div;
                };
                return control;
            }())
            .addTo(_fenixmap.map);
        }
    }
}
