/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["TM"],
                "show_lists": false
            },

            items: [
                {
                    "id": "reporterarea",
                    "type": "codelist",
                    "parameter": "reporterarea",
                    "componentType": {
                        "class": "col-xs-12 col-sm-4 col-md-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "reporterarea",
                        "defaultCodes": ["2"],
                        "filter": {}
                    }
                },
                {
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "componentType": {
                        "class": "col-xs-12 col-sm-4 col-md-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["15"],
                        "filter": {}
                    }
                },
                {
                    "id": "element",
                    "type": "codelist",
                    "parameter": "element",
                    "componentType": {
                        "class": "col-xs-12 col-sm-4 col-md-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "element",
                        "defaultCodes": ["2610"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-xs-4 col-sm-4 col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1993'],
                        "filter": {
                        }
                    }
                },
                C.filter.aggregation
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['TM']
            },

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{reporterarea}} {{item}} {{element}}",
                                fr: "{{reporterarea}} {{item}} {{element}}",
                                es: "{{reporterarea}} {{item}} {{element}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        template: {

                        },
                        adapter: {
                            dimensions: {
                                geoDimensions: {
                                    dimension_id: 'partnerarea',
                                    type: 'code'
                                }
                            }
                        }

                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation', 'reporterarea'],
                    deniedTemplateFilter: [],
                    filter: {
                        partnerarea: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'reporterarea'
                    }
                }
            ]
        }

    }
});