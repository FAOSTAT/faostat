/*global define*/
define([
    'jquery',
    'config/browse_by_domain/Config'
],function ($, C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["RL"],
                "show_lists": false
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "item",
                    "componentType": {
                        "class": "col-sm-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["6610"],
                        "filter": {}
                    }
                },
                {
                    "id": "element",
                    "type": "codelist",
                    "parameter": "element",
                    "componentType": {
                        "class": "col-sm-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "element",
                        "defaultCodes": ["7209"],
                        "filter": {}
                    }
                },
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["5000"],
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
                        "defaultCodes": ['1961','2016'],
                        "filter": {
                        }
                    }
                },
                $.extend(true, {}, C.filter.aggregation, {
                    "componentType": {
                        "class": "hidden"
                    },
                    "defaultCodes": ["AVG"]
                })
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['RL']
            },

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels
                    labels: {

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{item}} - {{element}} by country (1000 ha)",
                                fr: "{{item}} - {{element}} par pays (1000 ha)",
                                es: "{{item}} - {{element}} por países (1000 ha)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'area'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{item}} - {{element}} (1000 ha)",
                                fr: "{{item}} - {{element}} (1000 ha)",
                                es: "{{item}} - {{element}} (1000 ha)"
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
                    allowedFilter: ['year', 'item', 'element','area'],
                    filter: {
                        "order_by": 'area, year'
                    }
                },

                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "{{item}} by continent, {{element}}",
                                fr: "{{item}} par continent, {{element}}",
                                es: "{{item}} por continente, {{element}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['area']
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                },
                                colors: ['#1976D2','#D32F2F','#FFA000','#388E3C','#5E35B1','#303F9F','#0099C6',
                                    '#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300',
                                    '#8B0707','#329262','#5574A6','#3B3EAC']
                            }
                        }
                    },
                    allowedFilter: ['year', 'item', 'aggregation'],
                    filter: {
                        // TODO: remove the area (in theory should be automatically detected from the domain dimensions/schema)
                        area: ["5100", "5200", "5300", "5400", "5500"],
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
                                "en":"{{item}} - {{element}} (Top 10 Countries)",
                                "fr":"{{item}} - {{element}} (10 pays principaux)",
                                "es":"{{item}} - {{element}} (los 10 países principales)"
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
                            seriesDimensions: ['element'],
                            decimalPlaces: 2
                        },
                        template: {
                            //height:'250px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                },
                                legend: {
                                    enabled: false
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        "group_by": 'year, item',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});