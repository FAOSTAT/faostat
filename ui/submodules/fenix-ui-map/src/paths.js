define(function() {

	var FENIX_CDN = '//fenixrepo.fao.org/cdn/js/';

	return {

		baseUrl: '../',

		paths: {
			'i18n'                  :FENIX_CDN+'requirejs/plugins/i18n/2.0.4/i18n',
			'text'                  :FENIX_CDN+'requirejs/plugins/text/2.0.11/text',
			'domready'              :FENIX_CDN+'requirejs/plugins/domready/2.0.1/domReady',

			'jquery'                :FENIX_CDN+'jquery/2.1.1/jquery.min',
			'bootstrap'             :FENIX_CDN+'bootstrap/3.2/js/bootstrap.min',
			'underscore'            :FENIX_CDN+'underscore/1.7.0/underscore-min',
			'handlebars'            :FENIX_CDN+'handlebars/2.0.0/handlebars.min',
			
			'hoverintent'           :FENIX_CDN+'hoverintent/dist/hoverintent.min',
			'leaflet'               :FENIX_CDN+'leaflet/0.7.7/leaflet-src',
			'leaflet.markercluster' :FENIX_CDN+'leaflet/plugins/leaflet.markercluster/1.1/leaflet.markercluster',
			'powertip'              :FENIX_CDN+'jquery.powertip/1.2.0/jquery.powertip.min',

			'chosen'                :FENIX_CDN+'chosen/1.2.0/chosen.jquery.min',
			'jquery-ui'             :FENIX_CDN+'jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
			'jquery.i18n.properties':FENIX_CDN+'jquery/1.0.9/jquery.i18n.properties-min',
			'jquery.hoverIntent'    :FENIX_CDN+'jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',

			'fenix-map'             :'dist/fenix-ui-map.src',
			'fenix-map-config'      :'dist/fenix-ui-map-config'
			//'import-dependencies'   :'//fenixrepo.fao.org/cdn/js/FENIX/utils/import-dependencies-1.0',
		},

		shim: {
			'bootstrap'   : ['jquery'],
			'chosen'      : ['jquery'],
			'jquery-ui'   : ['jquery'],
			'powertip'    : ['jquery'],
			'hoverintent' : ['jquery'],
			'jquery.i18n.properties': ['jquery'],
			'jquery.hoverIntent'    : ['jquery'],
			'underscore'  : {
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
				//'hoverintent',
				//'jquery-ui',				
				'powertip',
				'jquery.i18n.properties',
				'fenix-map-config',
				'jquery.hoverIntent'
			]
		}
	};
});