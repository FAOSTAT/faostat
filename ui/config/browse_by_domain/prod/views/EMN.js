/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';



    return {


        "filter": {

            defaultFilter: {
                "domain_code": ["EMN"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "title": {
                        "en": "Sector"
                    },
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1757"],
                        "filter": {
                            //whitelist: [1711, 6822]
                        }
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
                        "defaultCodes": ["72380"],
                        "filter": {
                            whitelist: [72538, 72381, 72380, 72386]
                        }
                    }
                },

                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
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
                        "dimension_id": "years",
                        "defaultCodes": ['1961'],
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
                domain_code: ['EMN']
               // element: ["72538"]
            },

            items: [
                {
                    type: 'map',
                    class: "col-md-12",

                    // labels
                    labels: {

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{element}} by {{item}}",
                                fr: "{{element}} par {{item}}",
                                es: "{{element}} de {{item}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>", "351"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{element}} by {{item}}",
                                fr: "{{element}} par {{item}}",
                                es: "{{element}} de {{item}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item', 'element']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item', 'element'],
                    deniedOnLoadFilter: ['area'],
                    filter: {
                        area: ["5000", "5848", "5849"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "{{element}}, {{item}} by continent",
                                fr: "{{element}}, {{item}} par continent",
                                es: "{{element}}, {{item}} por continent"
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
                        creator: {}
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
                    class: "col-md-12",

                    labels: {
                        template: {
                            title: {
                                en: "{{element}}, {{area}}",
                                fr: "{{element}}, {{area}}",
                                es: "{{element}}, {{area}}"
                            },
                            subtitle: "{{area}}, {{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['item'],
                            decimalPlaces: 2
                        },
                        template: {
                            height: '300px'
                        },
                        creator: {
                        }
                    },
                    //'area',
                    allowedFilter: ['area', 'year', 'element','aggregation'],

                    filter: {
                        //area: ["5100", "5200", "5300", "5400", "5500"],

                        item: [
                            946,
                            960,
                            961,
                            976,
                            1016,
                            1048,
                            1049,
                            1051,
                            1052,
                            1053,
                            1054,
                            1068,
                            1079,
                            1096,
                            1107,
                            1110,
                            1126,
                            1177
                        ],
                        area: ["5000>", "351"],
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
                                en: "Top 10 areas by {{element}}, {{item}}",
                                fr: "Les 10 pays principaux par {{element}}, {{item}}",
                                es: "Los 10 países principals segun  {{element}}, {{item}}",
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
                            seriesDimensions: ['item', 'element']
                        },
                        template: {
                            //height:'250px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});