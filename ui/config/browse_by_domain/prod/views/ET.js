/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["ET"],
                // this force all the filters to avoid the "lists" codes
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "month",
                    //"title": "Reference Period"
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["7020"],
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
                        "defaultCodes": [],
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
                domain_code: ['ET'],
                element: ["7271"]
            },

            // labels
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                }
            },

            //bridge configuration
            bridge: {

                type: "faostat",
                //requestType: 'data' // data, rankings
            },

            metadata: {},

            items: [
                {
                    type: 'map',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // labels to dynamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Mean Temperature Change - {{year}}",
                                fr: "Variation moyenne de température - {{year}}",
                                es: "Variación media de temperatura  - {{year}}"
                            },
                           // subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        layer: {
                            colors: ['#0886D1','#5A9FDD', '#95CAD9','#cce6ff','#FFD34A', '#FF9400', '#DE0000'],
                            ranges: [-1.5,-1,-0.5,0,0.50,1.50],
                            classification: "custom"

                            //colors: "004529,238B45,74C476,E1E1E1,FFD34A,FF9400,DE0000",
                            //ranges: "-20000,-10000,-1,1,10000,100000"
                            // intervals: 3,
                        },
                        template: {}
                    },
                    allowedFilter: ['item'],
                    deniedTemplateFilter: [],
                    filter: {
                        year:'2018',
                        area: ["5000>", "351"],
                       // area: ["5000", "5100", "5200", "5300", "5400", "5500"],
                        //"group_by": 'year',
                        "order_by": 'area'
                    }
                },


                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Mean Temperature Change of {{item}}",
                                fr: "Variation moyenne de température de {{item}}",
                                es: "Variación media de temperatura de {{item}}"
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
                        template: {
                            height:'550px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['item','year'],
                    deniedOnLoadFilter: ['area'],
                    filter: {
                        area: ['5000', '5848', '5849'],
                        element: ['7271']
                    }
                },


                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Top 10 values by {{item}}",
                                fr: "Les 10 premières valeurs par {{item}}",
                                es: "Los 10 valores más importantes según {{item}}"
                            },
                            subtitle: "{{year}}"
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
                             height:'280px'
                        },

                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item','aggregation'],
                    deniedTemplateFilter: [],

                    filter: {
                        area: ["5000>"],
                        element: [7271],
                        "group_by": 'year, item',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Bottom 10 values by {{item}}",
                                fr: "Les 10 dernières valeurs par {{item}}",
                                es: "Les 10 valores mínimos según {{item}}"
                            },
                            subtitle: "{{year}}"
                            //subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
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
                            height:'280px'
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
                    allowedFilter: ['year', 'item','aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        element: [7271],
                        "group_by": 'year, item',
                        "order_by": 'value ASC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});