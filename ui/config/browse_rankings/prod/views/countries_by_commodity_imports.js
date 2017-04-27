/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["TP"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-xs-6 col-sm-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["15"],
                        "filter": {
}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-xs-3 col-sm-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {
                            "blacklist": ["2014"]
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                List1Codes: ["_1"],
                List2Codes: null,
                List3Codes: null,
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places:2,
                "null_values": false,
                filter_list: "3",
                rank_type: 'DESC'
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
                requestType: 'rankings' // data, rankings

            },

            metadata: {},

            items: [
                //EXEC Warehouse.dbo.usp_Rank @DomainCode = '(QA,QC,QD,QL,QP)', @List1Codes = '(''2'')', @List2Codes = '(''5510'')', @List3Codes = '(''_1'')', @List4Codes = '(''2013'')', @FilterList = 1, @RankType = 'DESC', @NoResults = 10, @Lang = 'E'
                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Top 10 Country Importers, import quantity of {{item}}",
                                fr: "Top 10 Country importateurs, import quantity of {{item}}",
                                es: "Top 10 Country importadores, import quantity of {{item}}"
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
                            seriesDimensions: ['item', 'element']
                        },
                        template: {
                            height:'275px'
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
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5610"],
                        limit: "10"
                    }
                },

                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Top 10 Country Importers, import Value of {{item}}",
                                fr: "Top 10 Country importateurs, import Value of  {{item}}",
                                es: "Top 10 Country importadores, import Value of  {{item}}"
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
                            seriesDimensions: ['item', 'element']
                        },
                        template: {
                            height:'275px'
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
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5622"],
                        limit: "10"
                    }
                },


                // FORCE SPACING
                {
                    type: 'custom',
                    class: 'clearfix',
                    config: {
                        template: {},
                        model: {}
                    }
                },

                {
                    type: 'table',
                    class: "col-md-12",

                    // labels
                    labels: {
                        template: {
                            title: {
                                en: "Top 20 Country Importers, import Value of  {{item}}",
                                fr: "Top 20 Country Importers, import Value of {{item}}",
                                es: "Top 20 Country Importers, import Value of {{item}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            columns: ['area', 'item', 'year', 'value', 'unit', 'flag'],
                            showCodes: false
                        },
                        template: {
                            tableOptions: {
                                'data-search': true,
                                'data-show-header': false
                            }
                            // height: '300'
                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5610"],
                        limit: "20"
                    }
                },

                {
                    type: 'table',
                    class: "col-md-12",

                    // labels
                    labels: {
                        template: {
                            title: {
                                en: "Top 20 Country Importers, import Value of {{item}}",
                                fr: "Top 20 Country Importers, import Value of {{item}}",
                                es: "Top 20 Country Importers, import Value of {{item}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            columns: ['area', 'item', 'year', 'value', 'unit', 'flag'],
                            showCodes: false
                        },
                        template: {
                            tableOptions: {
                                'data-search': true,
                                'data-show-header': false
                            }
                            // height: '300'
                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5622"],
                        limit: "20"
                    }
                }

            ]
        }

    };
});