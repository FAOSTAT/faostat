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
                      //  "defaultCodes": ["5000"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-xs-4 col-sm-4 col-md-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
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
                                en: "Mean Temperature Change",
                                fr: "Mean Temperature Change",
                                es: "Mean Temperature Change"
                            },
                           // subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item','year'],
                    deniedTemplateFilter: [],
                    filter: {
                        year:'2016',
                        area: ["5000>", "351"],
                       // area: ["5000", "5100", "5200", "5300", "5400", "5500"],
                        //"group_by": 'year',
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
                                en: "Mean Temperature Change of {{item}}",
                                fr: "Mean Temperature Change of {{item}}",
                                es: "Mean Temperature Change of {{item}}"
                            },
                            subtitle: "1961 – 2016"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area']
                        },
                        template: {
                             height:'550px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['item','area'],
                    deniedOnLoadFilter: ['area'],
                    filter: {
                        year:[1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016],
                        area: [5848, 5849, 5000],
                        element: [7271]
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
                                en: "Top 10 countries by temperature change in {{item}}",
                                fr: "Top 10 countries by temperature change in {{item}}",
                                es: "Top 10 countries by temperature change in {{item}}"
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
                                en: "Bottom 10 countries by temperature change in {{item}}",
                                fr: "Bottom 10 countries by temperature change in {{item}}",
                                es: "Bottom 10 countries by temperature change in {{item}}"
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