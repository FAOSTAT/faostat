/*global define*/
define(function () {

    'use strict';

    var config = {

        paths : {
            'fs-s-m/start': './start',
            'fs-s-m/html': '../html',
            'fs-s-m/config': '../../config',
            'fs-s-m/nls': '../../nls',

            // third party libs
            jquery: '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            underscore: '{FENIX_CDN}/js/underscore/1.7.0/underscore.min',
            amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            handlebars: '{FENIX_CDN}/js/handlebars/2.0.0/handlebars',
            loglevel: '{FENIX_CDN}/js/loglevel/1.4.0/loglevel',
            i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n"

        },

        shim: {
            "amplify": {
                "deps": ["jquery"]
            }
        }
    };

    return config;
});
