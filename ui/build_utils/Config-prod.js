/*global define, document*/
define([
    'jquery',
    'loglevel',
    'underscore.string',
    'amplify'
], function ($, log, _s) {

    'use strict';

    return {

        "URL_API": "http://fenixservices.fao.org/faostat/api/v1/",
        "LOGLEVEL": "silent", // trace/debug/info/warn/error/silent
        "API_LOG": false,

        // Google Analytics ID
        "GOOGLE_ANALYTICS": [
            {
                ID: "UA-68486942-1",
                NAME: "FAOSTAT-PRODUCTION"
            },

            {
                ID: "UA-16957842-1",
                NAME: "fao.org"
            },
            {
                ID: "UA-16796074-1",
                NAME: "allTracker"
            },
            {
                ID: "UA-16957552-1",
                NAME: "allSites"
            }

        ],

        // URLs
        "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://fenixservices.fao.org/faostat/static/documents/',
        "URL_RELEASE_CALENDAR": 'http://fenixservices.fao.org/faostat/static/releasecalendar/Default.aspx',
        "URL_FEEDBACK_SYSTEM": 'http://fenixapps2.fao.org/feedbacksystem',

        "JIRA_COLLECTOR": {
            "ENABLED": false
        },

        // EMAIL and TELEPHONE
        "EMAIL_FAO_STATISTICS": "FAO-statistics@fao.org",
        "TELEPHONE_FAO_STATISTICS": "+39 06 570 55303",

        //Chaplin JS configuration
        CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
        CHAPLINJS_PROJECT_ROOT: '',
        CHAPLINJS_PUSH_STATE: false,
        CHAPLINJS_SCROLL_TO: true,
        CHAPLINJS_APPLICATION_TITLE: "FAOSTAT",

        DATE_UPDATE: "@@date_update",
        VERSION: "@@version",

        ALL_LANGUAGES: true

    };

});
