/*global define, document*/
define(['jquery'], function ($) {

    'use strict';

    return {
        "API_LOG": false,
        "LOGLEVEL": "trace", // trace/debug/info/warn/error/silent

        // Google Analytics ID
        "GOOGLE_ANALYTICS": [
            {
                ID: "UA-68486942-5",
                NAME: "FAOSTAT-LOCALHOST"
            }
        ],

        "GOOGLE_ANALYTICS_TRACKER":"/faostat/",

        // URLs

        "URL_RELEASE_CALENDAR": 'http://fenixservices.fao.org/faostat/static/releasecalendar/Default.aspx',
        "URL_FEEDBACK_SYSTEM": 'http://fenixapps2.fao.org/feedbacksystem',

        "JIRA_COLLECTOR": {
            "ENABLED": true,
            "URL": "https://jira.fao.org/ciok/s/en_US-8e74xy/787/3/1.1.2/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=cb5d8c3f"
        },
        //Chaplin JS configuration
        CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
        CHAPLINJS_PROJECT_ROOT: '',
        CHAPLINJS_PUSH_STATE: false,
        CHAPLINJS_SCROLL_TO: true,
        CHAPLINJS_APPLICATION_TITLE: "FAOSTAT",

        // enable all 6 languages. If false use only english/spanish/french
        ALL_LANGUAGES: true,

        DATE_UPDATE: "@@date_update",
        VERSION: "@@version",


        // ####### External configuration #########

        "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://fenixservices.fao.org/faostat/static/documents/', // Related documents in data section

        URL_DB_DESCRIPTION : "http://fenixservices.fao.org/faostat/static/bulkdownloads", // Db description

        syb: {
             url: 'http://faostat.fao.org/static/syb/syb_{{code}}.pdf', // Country profile download
            //url_world: 'http://fenixservices.fao.org/faostat/static/documents/CountryProfile/pdf/syb_5000.pdf'
            url_world: 'http://faostat.fao.org/static/syb/syb_5000.pdf' // Country world download
         }

    };

});
