/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["FS"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-8 col-sm-6 col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["5000"],
                        "filter": {}
                    }
                },
                {
                    "id": "year3",
                    "type": "codelist",
                    "parameter": "year3",
                    "componentType": {
                        "class": "hidden",
                        "type": "dropDownList-timerange"
                        ////"class": "col-xs-4 col-sm-4 col-md-2",
                        //"type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year3",
                        "filter": {}
                    }
                }

            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['FS'],
                element: [6120]
            },
            
            items: [
                /*
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Prevalence of undernourishment (%) - 3 years average",
                                fr: "Prévalence de la sous-alimentation (%) (moyenne sur 3 ans)",
                                es: "Prevalencia de la subalimentación (%) (promedio de 3 años)"
                            },

                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year3',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 1
                        },
                        creator: {
                            chartObj: {
                                xAxis: {
                                    labels: {
                                        rotation: -45
                                    }
                                }
                            }
                        },
                        template: {
                        }
                    },
                    allowedFilter: ['area', 'year3'],
                    filter: {
                        item: [21004],
                        order_by: 'year3'
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
                                en: "Average dietary supply adequacy (%)",
                                fr: "Suffisance des apports énergétiques alimentaires moyens (%) (moyenne sur 3 ans)",
                                es: "Suficiencia del suministro medio de energía alimentaria (%) (promedio de 3 años)"
                            },

                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year3',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 1
                        },
                        creator: {
                            chartObj: {
                                xAxis: {
                                    labels: {
                                        rotation: -45
                                    }
                                }
                            }
                        },
                        template: {
                        }
                    },
                    allowedFilter: ['area', 'year3'],
                    filter: {
                        item: [21010],
                        order_by: 'year3'
                    }
                }
                */
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Prevalence of undernourishment (percent) (annual value)",
                                fr: "Prévalence de la sous-alimentation (%) (valeur annuelle)",
                                es: "Prevalencia de la subalimentación (%) (valor anual)"
                            },

                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year3',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 1
                        },
                        creator: {
                            chartObj: {
                                colors: ['#1976D2', '#D32F2F'],
                                legend : {
                                    layout: 'vertical'
                                }
                            }
                        },
                        template: {}
                    },
                    allowedFilter: ['area', 'year3'],
                    filter: {
                        item: [21004],
                        order_by: 'year3'
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
                                en: "Prevalence of severe food insecurity in the total population (percent) (annual value)",
                                fr: "Prévalence de l’insécurité alimentaire grave – population totale (%) (valeur annuelle)",
                                es: "Prevalencia de la inseguridad alimentaria grave en la población total (%) (valor anual)"
                            }

                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year3',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 1
                        },
                        creator: {
                            chartObj: {
                                colors: ['#D32F2F','#1976D2'],
                                legend : {
                                    layout: 'vertical',
                                    reversed: true
                                }
                            }
                        },
                        template: {}
                    },
                    allowedFilter: ['area', 'year3'],
                    filter: {
                        item: [21040],
                        order_by: 'year3'
                    }
                }
            ]
        }

    }
});