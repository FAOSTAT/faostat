/*global define*/
define([
    'jquery',
    'config/browse_by_domain/Config'
],function ($, C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["EP"],
                "show_lists": false
            },

            items: [
                /*{
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "componentType": {
                        "class": "col-sm-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1357"],
                        "filter": {
                            whitelist: ["1357"]//5195
                        }
                    }
                },*/
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["1"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-sm-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1990'],
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
                domain_code: ['EP'],
                element: ["5159"],
                item:["1357"]
            },

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Pesticides - {{aggregation}} use per area of cropland (kg/ha)",
                                fr: "Pesticides - {{aggregation}} use per area of cropland (kg/ha)",
                                es: "Plaguicidas - {{aggregation}} use per area of cropland (kg/ha)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>", "351"],
                        element: ["5159"],
                        item: ["1357"],
                        "group_by": 'year',
                        "order_by": 'area'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Pesticides - {{aggregation}} use per area of cropland",
                                fr: "Pesticides - {{aggregation}} use per area of cropland",
                                es: "Plaguicidas - {{aggregation}} use per area of cropland"
                            },
                            subtitle: "{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: "year",
                            yDimensions: "unit",
                            valueDimensions: 'value',
                            seriesDimensions: ['area'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['year', 'item','element','area', 'aggregation'],
                    deniedOnLoadFilter: [],
                    filter: {

                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Pesticides - {{aggregation}} use per area of cropland (Top 10 Countries)",
                                fr: "Pesticides - {{aggregation}} use per area of cropland (10 pays principaux)",
                                es: "Plaguicidas - {{aggregation}} use per area of cropland (los 10 países principales)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['area'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
                        },
                        template: {
                            height:'250px'
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item','element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        "group_by": 'year, item',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Pesticides - {{aggregation}} use per area of cropland (Bottom 10 Countries)",
                                fr: "Pesticides - {{aggregation}} use per area of cropland (10 pays principaux)",
                                es: "Plaguicidas - {{aggregation}} use per area of cropland (los 10 países principales)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['area'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
                        },
                        template: {
                            height:'250px'
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item','element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        "group_by": 'year, item',
                        "order_by": 'value ASC',
                        "limit": '10'
                    }
                }
            ]
        }
    };
});