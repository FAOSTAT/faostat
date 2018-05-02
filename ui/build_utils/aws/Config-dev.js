/*global define, document*/
define([
    'jquery',
    'loglevel',
    'underscore.string',
    'amplify'
], function ($, log, _s) {

    'use strict';

    var config =  {

        "URL_API": "http://faostatdev.aws.fao.org/faostat/api/v1/", //TODO change with AWS URL
        "LOGLEVEL": "trace", // trace/debug/info/warn/error/silent
        "API_LOG": false,
        "DATASOURCE": "dev", // TODO to be confirmed

        // Google Analytics ID
        "GOOGLE_ANALYTICS": [
            {
                ID:"UA-68486942-2",
                NAME: "FAOSTAT-DEV"
            }

        ],

        "GOOGLE_ANALYTICS_TRACKER":"/faostat/",

        // URLs
        "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://fenixservices.fao.org/faostat/static/documents/', //TODO change with AWS URL
        "URL_RELEASE_CALENDAR": 'http://fenixservices.fao.org/faostat/static/releasecalendar/Default.aspx',
        "URL_FEEDBACK_SYSTEM": 'http://fenixapps2.fao.org/feedbacksystem',

         "JIRA_COLLECTOR": {
                "ENABLED": true,
                "URL": "https://jira.fao.org/ciok/s/en_US-8e74xy/787/3/1.1.2/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=13a16039"
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

     $('body').prepend('<div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                    'FAOSTAT is in <strong>DEV</strong> mode. Using <strong>' + config.DATASOURCE.toUpperCase() + '</strong> datasource' +
                    '</div>');

    return config;

});
