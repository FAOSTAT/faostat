/*global define, document*/
define([
    'jquery',
    'loglevel',
    'underscore.string',
    'amplify'
], function ($, log, _s) {

    'use strict';

    var host = document.location.hostname,
        href = document.location.href,
        DEFAULT = {

            "URL_API": "http://fenixservices.fao.org/faostat/api/v1/",
            "DATASOURCE": "production",
            "LOGLEVEL": "silent", // trace/debug/info/warn/error/silent
            "API_LOG": true,

            "JIRA_COLLECTOR": {
                "ENABLED": false
            },

            "GOOGLE_ANALYTICS_TRACKER":"/faostat/",

            // URLs
            "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://fenixservices.fao.org/faostat/static/documents/',
            "URL_RELEASE_CALENDAR": 'http://fenixservices.fao.org/faostat/static/releasecalendar/Default.aspx',
            "URL_FEEDBACK_SYSTEM": 'http://fenixapps2.fao.org/feedbacksystem',

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

    log.info("href",  href);

    // QA
    if (_s.contains(href, "/qa/")) {

        return $.extend(true, {}, DEFAULT, {

            // Configuration
            "URL_API": "http://fenix.fao.org/faostat/qa/api/v1/",
            "DATASOURCE": "qa",
            "GOOGLE_ANALYTICS": [
                {
                    ID:"UA-68486942-3",
                    NAME: "FAOSTAT-QA"
                }
            ],
            "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://fenixservices.fao.org/faostat/static/documents/',
            "JIRA_COLLECTOR": {
                "ENABLED": true,
                "URL": "https://jira.fao.org/ciok/s/en_US-8e74xy/787/3/1.1.2/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=13a16039"
            }
        });

    }

    // Dev
    else if (_s.contains(href, "/dev/")) {

        var o = {

            // Configuration
            "URL_API": "http://fenix.fao.org/faostat/dev/api/v1/",
            "GOOGLE_ANALYTICS": [
                {
                    ID:"UA-68486942-2",
                    NAME: "FAOSTAT-DEV"
                }
            ],
            "LOGLEVEL": "trace",
            "JIRA_COLLECTOR": {
                "ENABLED": true,
                "URL": "https://jira.fao.org/ciok/s/en_US-8e74xy/787/3/1.1.2/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=13a16039"
            }

        };

        if (_s.contains(href, "/db3/")) {
            o.DATASOURCE = "db3";
        }

        if (_s.contains(href, "/db4/")) {
            o.DATASOURCE = "db4";
        }

        if (_s.contains(href, "/latest/")) {
            o.DATASOURCE = "test";//production dissemination
        }

        if (_s.contains(href, "/dev/internal/")) {
            o.DATASOURCE = "internal";
            o.URL_FAOSTAT_DOCUMENTS_BASEPATH = "http://168.202.3.183:8080/FAOSTATFiles/";
            o.URL_RELEASE_CALENDAR = 'http://168.202.3.183:8080/releasecalendar/Default.aspx';
        }

        // temporary versionin
        if (_s.contains(href, "/v/")) {
            o.DATASOURCE = "production";
            o.LOGLEVEL = "silent";
        }

        o = $.extend(true, {}, DEFAULT, o);

        if (!_s.contains(href, "/v/")) {
            $('body')
                .prepend('<div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                    'FAOSTAT is in <strong>DEV</strong> mode. Using <strong>' + o.DATASOURCE.toUpperCase() + '</strong> datasource' +
                    '</div>');
        }

        return o;
    }

    // Internal
    else if (_s.contains(href, "/internal/")) {

        return $.extend(true, {}, DEFAULT, {

            // Configuration
            "URL_API": "http://fenix.fao.org/faostat/internal/api/v1/",
            "DATASOURCE": "internal",
            "GOOGLE_ANALYTICS": [
                {
                    ID:"UA-68486942-4",
                    NAME: "FAOSTAT-INTERNAL"
                }
            ],
            "URL_FAOSTAT_DOCUMENTS_BASEPATH": "http://168.202.3.183:8080/FAOSTATFiles/",
            "URL_RELEASE_CALENDAR": 'http://168.202.3.183:8080/releasecalendar/Default.aspx',
            "JIRA_COLLECTOR": {
                "ENABLED": true,
                "URL": "https://jira.fao.org/ciok/s/en_US-8e74xy/787/3/1.1.2/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=13a16039"
            }

        });

    }

    return DEFAULT;

});
