
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

		var m = new FM.Map('#map', {
			plugins: {
				zoomcontrol: 'bottomright',			
				disclaimerfao: true,
				fullscreen: true,
				geosearch: true,
				mouseposition: false,
				controlloading : true,
				zoomResetControl: true
			},
			guiController: {
				overlay: true,
				baselayer: true,
				wmsLoader: true
			},
			url: {
				MAP_SERVICE_SHADED: 'http://fenix.fao.org/test/geo/fenix/mapclassify/join/',
				DEFAULT_WMS_SERVER: 'http://fenix.fao.org/geoserver',
				MAP_SERVICE_GFI_JOIN: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/',
				MAP_SERVICE_GFI_STANDARD: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/'
			}
		});

		m.createMap();

		var joincolumnlabel = 'areanamee';
		var joincolumn = 'faost_code';
		var l = new FM.layer({
			// PYTHON
			colorramp: "YlGnBu",
			classificationtype: "Jenks_Caspall_Forced",
			joindata: [{1: 2.0520652E8},{2:512094.0},{4:320.0},{7:37608.0},{9:1563450.0},{10:1161115.0},{16:5.15E7},{18:78730.0},{19:426050.6009},{21:1.1782549E7},{23:20505.0},{25:4200.0},{26:1850.0},{27:54900.0},{28:2.8767E7},{29:41454.0},{32:194094.0},{37:42500.0},{38:4620730.0},{39:330000.0},{40:130307.0},{41:2.036122E8},{44:2048938.0},{45:29000.0},{46:1700.0},{48:224570.0},{49:672600.0},{52:4833.0},{53:206943.0},{56:824000.0},{58:1516045.0},{59:6100000.0},{60:36254.0},{66:5000.0},{68:82000.0},{69:2020.0},{74:1700.0},{75:69704.0},{81:569524.0},{84:227000.0},{89:32051.0},{90:2053000.0},{91:823800.0},{93:169299.66},{95:49656.0},{97:9800.0},{100:1.592E8},{101:7.1279709E7},{102:2900000.0},{103:451849.0},{106:1339000.0},{107:1934154.0},{108:344300.0},{109:31.0},{110:1.0758E7},{113:27220.0},{114:146696.0},{115:9390000.0},{116:2901000.0},{117:5631689.0},{120:3415000.0},{123:238000.0},{129:3610626.0},{130:125156.0},{131:2626881.0},{133:2211920.0},{136:192000.0},{137:646.0},{138:179776.0},{143:37716.0},{144:351000.0},{145:165.0},{149:4504503.0},{154:27921.0},{157:377470.0699},{158:40000.0},{159:4700000.0},{165:6798100.0},{166:287395.0},{168:1300.0},{169:617397.0},{170:3050934.028},{171:1.8439406E7},{174:168300.0},{175:209717.0},{176:87000.0},{181:700.0},{182:260.0},{183:54646.0},{184:93746.0},{185:934943.0},{195:423482.0},{197:1255559.0},{201:1970.0},{202:3000.0},{203:851500.0},{206:25000.0},{207:262029.0},{208:98000.0},{209:105.0},{213:130000.0},{214:1594320.0},{215:2194750.0},{216:3.60626E7},{217:164998.0},{220:2859.0},{223:900000.0},{226:214000.0},{230:145050.0},{231:8613094.0},{233:305382.0},{234:1359000.0},{235:340219.0},{236:1005000.01},{237:4.403929126E7},{238:184210.0},{250:355000.0},{251:44747.0}],
			//"doublecounting": false,
			//"decimalvalues": 0,
			joincolumn: joincolumn,
			layers: 'fenix:gaul0_faostat_3857',
			//layertitle: 'Join Dataset',
			layertype: 'JOIN',
			jointype: 'shaded',
			defaultgfi: true,
			openlegend: true,
			lang: "EN",
			opacity: '0.7',
			customgfi: {
				content: {
					EN: "<div class='fm-popup'>{{"+ joincolumnlabel +"}}<div class='fm-popup-join-content'>{{{"+ joincolumn+"}}}</div></div>"
				},
				showpopup: true
			}
		});
		m.addLayer(l);

		m.addLayer( new FM.layer({
			layers: 'fenix:gaul0_line_3857',
			layertitle: 'Country Boundaries',
			urlWMS: 'http://fenixapps.fao.org/geoserver',
			opacity: '0.8',
			lang: 'EN'
		}) );

	   // //m.zoomTo("country", "iso3", ["THA"]);
	   // //m.zoomTo("country", "iso2", "GE");
	});

});









