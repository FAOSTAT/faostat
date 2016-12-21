
requirejs(['../src/paths'], function (paths) {
	'use strict';

	paths.baseUrl = '../';

	require.config(paths);

	require([
		'jquery','jquery','underscore','bootstrap','handlebars',
		'fenix-map',
		'fenix-map-config',
		'domready!'
	], function($,jQuery,_,bts,Handlebars,
		FenixMap, FenixMapConf) {

		
		_.extend(FenixMapConf, {
			BASEURL: '../dist',
			BASEURL_LANG: '../dist/i18n/'
		});

		window.map = new FM.Map('#map', {
			plugins: {
				disclaimerfao: true,
				geosearch: true,
				mouseposition: false,
				controlloading : true,
				zoomcontrol: 'bottomright'
			},
			url: {
				MAP_SERVICE_SHADED: 'http://fenix.fao.org/test/geo/fenix/mapclassify/join/',
				DEFAULT_WMS_SERVER: 'http://fenix.fao.org/geoserver',
				MAP_SERVICE_GFI_JOIN: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/',
				MAP_SERVICE_GFI_STANDARD: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/'
			},		
			guiController: {
				overlay: false,
				baselayer: true,
				wmsLoader: false,
				layersthumbs: false
			},
			baselayers: {
				"osm": {
					url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					title_en: "OpenStreetMap"
				},
				"osm_grayscale": {
					url: "http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png",
					title_en: "OpenStreetMap Gray"
				},
				"esri": {
					url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
					title_en: "Esri WorldGrayCanvas",
	//TODO				attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
				}
			}
		});
		
		map.createMap();

	/*	map.addLayer( new FM.layer({
			layers: 'fenix:gaul0_line_3857',
			layertitle: 'Country Boundaries',
			urlWMS: 'http://fenixapps.fao.org/geoserver',
			opacity: '0.8',
			lang: 'EN'
		}) );
	*/
	   //map.zoomTo("country", "iso3", ["THA"]);
	   //map.zoomTo("country", "iso2", "GE");
	});

});







