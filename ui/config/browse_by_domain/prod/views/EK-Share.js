/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {
        "relatedViews" : [
            {
                title: {
                    en: "DENSITY",
                    fr: "DENSITY **",
                    es: "DENSITY ***"
                },
                id: 'EK'
            },
            {
                title: {
                    en: "SHARE",
                    fr: "SHARE **",
                    es: "SHARE ***"
                },
                id: 'EK-Share',
                selected: true
            }
        ],
        filter: {

            defaultFilter: {
                "domain_code": ["EK"],
                "show_lists": false
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "componentType": {
                        "class": "col-sm-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["866"],
                        "filter": {}
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
                        "dimension_id": "year",
                        "defaultCodes": ["1990"],
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
                domain_code: ['EK'],
                element: ["7211"],
            },

            // labels
            labels: {
                // labels to dynamically substitute the title and subtitle
                default: {
                    aggregation: C.i18n.average
                }
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
                                en: "Share of {{item}} in total livestock %",
                                fr: "Part de  {{item}} dans le montant total des animaux %",
                                es: "Cuota de {{item}} en el total de ganado %"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'area',
                        operator: 'avg'
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
                                en: "Share of {{item}} in total livestock % ",
                                fr: "Part de {{item}} dans le montant total des animaux %",
                                es: "Cuota de {{item}} en el total de ganado %"
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
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
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
                                en: "Top 10 countries by share of {{item}} in total livestock %",
                                fr: "Les 10 principaux pays par part de {{item}}] dans le montant total des animaux %",
                                es: "Los 10 países principales según la cuota de  {{item}} en el total de ganado %"
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
                    allowedFilter: ['year', 'item', 'aggregation'],
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
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Bottom 10 countries by share of {{item}} in total livestock %",
                                fr: "Les 10 derniers pays par part de {{item}} dans le montant total des animaux %",
                                es: "Los 10 últimos países según la cuota de {{item}} en el total de ganado %"
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
                    allowedFilter: ['year', 'item', 'aggregation'],
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

    }
});