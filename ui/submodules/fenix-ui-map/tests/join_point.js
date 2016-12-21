
require.config({

	baseUrl: '../',

	paths: {
		'i18n'                  :'node_modules/i18n/i18n',
		'text'                  :'node_modules/text/text',
		'domready'              :'node_modules/domReady/domReady',

		'jquery'                :'node_modules/jquery/dist/jquery.min',
		'bootstrap'             :'node_modules/bootstrap/dist/js/bootstrap.min',
		'underscore'            :'node_modules/underscore/underscore-min',
		'handlebars'            :'node_modules/handlebars/dist/handlebars.min',

		'hoverintent'           :'node_modules/hoverintent/dist/hoverintent.min',
		'leaflet'               :'node_modules/leaflet/dist/leaflet-src',
		//'leaflet.markercluster' :'node_modules/leaflet.markercluster/dist/leaflet.markercluster',
		'powertip'              :'node_modules/jquery-powertip/dist/jquery.powertip.min',

		//optionals
		'chosen'                :'node_modules/chosen-jquery/lib/chosen.jquery.min',
		'jquery-ui'             :'//fenixrepo.fao.org/cdn/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
		'jquery.i18n.properties':'//fenixrepo.fao.org/cdn/js/jquery/1.0.9/jquery.i18n.properties-min',
		'jquery.hoverIntent'    :'node_modules/jquery.hoverIntent/jquery.hoverIntent.min',


		'fenix-map'             :'dist/fenix-ui-map.src',
		'fenix-map-config'      :'dist/fenix-ui-map-config'
		//'import-dependencies'   :'//fenixrepo.fao.org/cdn/js/FENIX/utils/import-dependencies-1.0',
	},

	shim: {
		'bootstrap' : ['jquery'],
		'chosen'    : ['jquery'],
		'jquery-ui' : ['jquery'],
		'powertip'  : ['jquery'],
		'jquery.i18n.properties': ['jquery'],
		'hoverintent'    : ['jquery'],
		'underscore': {
			exports: '_'
		},
		'fenix-map': [
			'i18n',
			'jquery',
			'jquery-ui',
			'chosen',
			'leaflet',
			//'leaflet.markercluster'
			//'import-dependencies',				
			//'jquery-ui',
			//'hoverintent',
			'powertip',

			'jquery.i18n.properties',
			'fenix-map-config',
			'jquery.hoverIntent'
		]
	}
});

require([
	'jquery','underscore','bootstrap','handlebars',
	'fenix-map',
	'fenix-map-config',
	'domready!'
], function($,_,bts,Handlebars,
			FenixMap, FenixMapConf) {


	_.extend(FenixMapConf, {
		BASEURL: '../dist',
		BASEURL_LANG: '../dist/i18n/'
	});

	var m = new FM.Map('map', {
		plugins: {
			geosearch: true,
			mouseposition: false,
			controlloading : true,
			zoomControl: 'bottomright'
		},
		guiController: {
			overlay: true,
			baselayer: true,
			wmsLoader: true
		},
		gui: {
			disclaimerfao: true
		},
		url: {
			MAP_SERVICE_SHADED: 'http://fenix.fao.org/test/geo/fenix/mapclassify/join/',
			DEFAULT_WMS_SERVER: 'http://fenix.fao.org/geoserver',
			MAP_SERVICE_GFI_JOIN: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request',
			MAP_SERVICE_GFI_STANDARD: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request'
		}
	}, {
		zoomControl: false,
		attributionControl: false
	});

	m.createMap();

	m.addLayer( new FM.layer({
		layers: 'fenix:gaul0_line_3857',
		layertitle: 'Country Boundaries',
		urlWMS: 'http://fenix.fao.org/geoserver',
		opacity: '0.9',
		lang: 'en'
	}));


	var r = {
		//"decimalvalues": 5,
		layertype: 'JOIN',
		jointype: 'point',
		colorramp: "Greens",
		classificationtype: "Jenks_Caspall_Forced",
		joindata: [{1: 2.0520652E8},{2:512094.0},{4:320.0},{7:37608.0},{9:1563450.0},{10:1161115.0},{16:5.15E7},{18:78730.0},{19:426050.6009},{21:1.1782549E7},{23:20505.0},{25:4200.0},{26:1850.0},{27:54900.0},{28:2.8767E7},{29:41454.0},{32:194094.0},{37:42500.0},{38:4620730.0},{39:330000.0},{40:130307.0},{41:2.036122E8},{44:2048938.0},{45:29000.0},{46:1700.0},{48:224570.0},{49:672600.0},{52:4833.0},{53:206943.0},{56:824000.0},{58:1516045.0},{59:6100000.0},{60:36254.0},{66:5000.0},{68:82000.0},{69:2020.0},{74:1700.0},{75:69704.0},{81:569524.0},{84:227000.0},{89:32051.0},{90:2053000.0},{91:823800.0},{93:169299.66},{95:49656.0},{97:9800.0},{100:1.592E8},{101:7.1279709E7},{102:2900000.0},{103:451849.0},{106:1339000.0},{107:1934154.0},{108:344300.0},{109:31.0},{110:1.0758E7},{113:27220.0},{114:146696.0},{115:9390000.0},{116:2901000.0},{117:5631689.0},{120:3415000.0},{123:238000.0},{129:3610626.0},{130:125156.0},{131:2626881.0},{133:2211920.0},{136:192000.0},{137:646.0},{138:179776.0},{143:37716.0},{144:351000.0},{145:165.0},{149:4504503.0},{154:27921.0},{157:377470.0699},{158:40000.0},{159:4700000.0},{165:6798100.0},{166:287395.0},{168:1300.0},{169:617397.0},{170:3050934.028},{171:1.8439406E7},{174:168300.0},{175:209717.0},{176:87000.0},{181:700.0},{182:260.0},{183:54646.0},{184:93746.0},{185:934943.0},{195:423482.0},{197:1255559.0},{201:1970.0},{202:3000.0},{203:851500.0},{206:25000.0},{207:262029.0},{208:98000.0},{209:105.0},{213:130000.0},{214:1594320.0},{215:2194750.0},{216:3.60626E7},{217:164998.0},{220:2859.0},{223:900000.0},{226:214000.0},{230:145050.0},{231:8613094.0},{233:305382.0},{234:1359000.0},{235:340219.0},{236:1005000.01},{237:4.403929126E7},{238:184210.0},{250:355000.0},{251:44747.0}]
	};

	var codes = []
	for (var i=0; i < r.joindata.length; i++) {
		codes.push(Object.keys(r.joindata[i])[0])
	}

	 $.ajax({
	     type: 'POST',
	     url: 'http://fenix.fao.org/test/geo/fenix/mapclassify/join/',
		 //url: 'http://localhost:5555/mapclassify/join/',
	     data: JSON.stringify(r),
	     dataType: 'json',
	     contentType: "application/json; charset=utf-8",
	     success : function(response) {
	         var legend = response["legend"];
	         $.ajax({
	             type: 'GET',
	             url: 'http://fenix.fao.org/test/geo/fenix/spatialquery/db/spatial/centroid/layer/gaul0_faostat_3857/faost_code/' + codes.toString() +'/labels/faost_code,areanamee',
	             success : function(response) {

	                 var geoJsonData = response;

	                 //var radius_factor = 0.5*((legend.length/(legend.length/5)))

	                 $.each(geoJsonData["features"], function(index, value) {
	                     var code = value.properties.prop0;

	                     for (var index=0; index < legend.length; index++) {
	                         //console.log(legend[index]["codes"]);
	                         if ( $.inArray(code.toString(), legend[index]["codes"]) != -1) {
	                             // add color

	                             value.properties.radius = ((index+1)/(legend.length+1))*10;
	                             //value.properties.radius = 7;

	                             value.properties.color = legend[index]["color"];
	                             break;
	                         }
	                     }
	                 });

	                 // create geojson
	                 var geoJson = L.geoJson(geoJsonData, {
	                     pointToLayer: function(feature, latlng) {
	                         return L.circleMarker(latlng, {
	                             // Here we use the `count` property in GeoJSON verbatim: if it's
	                             // to small or two large, we can use basic math in Javascript to
	                             // adjust it so that it fits the map better.
	                             radius: feature.properties.radius,
	                             color: "#fff",
	                             fillColor: feature.properties.color,
	                             //color: "red",
	                             opacity: 0.4,
	                             fillOpacity: 0.7
	                         }).bindPopup(feature.properties.prop1)
	                         // TODO: how to handle the popup
	                     }
	                 }).addTo(m.map);

					 //m.map.fitBounds(geoJson.getBounds());

	             },
	             error : function(err, b, c) { }
	         });
	     },
	     error : function(err, b, c) { }
	 });
});