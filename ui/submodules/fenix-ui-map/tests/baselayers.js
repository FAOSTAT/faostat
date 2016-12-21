
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
				overlay: true,
				baselayer: true,
				wmsLoader: false
			},
			baselayers: {
				"world_imagery": {
					title_en: "World Imagery",
					url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
					attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
				},				
				"cartodb": {
					title_en: "CartoDB light",
					url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
					subdomains: 'abcd',
					maxZoom: 19
				},
				"esri_grayscale": {
					url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
					title_en: "Esri WorldGrayCanvas",
					attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
					maxZoom: 16
				}
			}
		});
		
		map.createMap(0,0,3);

		map.addLayer( new FM.layer({
			layers: 'fenix:gaul0_line_3857',
			layertitle: 'Country Boundaries',
			urlWMS: 'http://fenixapps.fao.org/geoserver',
			//opacity: '0.8',
			lang: 'EN'
		}) );

		var labelsLayer = new FM.layer({
	        layername: 'labels',
	        layertype: 'TILE',
	        layertitle: 'Country Labels',
	        lang: 'EN'
	    });

		labelsLayer.leafletLayer = new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
			subdomains: 'abcd',
			maxZoom: 19,
			opacity: 0.8,
			updateWhenIdle: false
		});

		map.addLayer(labelsLayer);
	   //map.zoomTo("country", "iso3", ["THA"]);
	   //map.zoomTo("country", "iso2", "GE");
	});

});







