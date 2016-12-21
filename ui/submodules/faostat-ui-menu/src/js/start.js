/*global define*/
/*jslint nomen: true*/
define(['jquery',
        'loglevel',
        'config/Config',
        'config/Routes',
        'config/browse_by_domain/Config',
        'handlebars',
        'text!faostat_ui_menu/html/templates.hbs',
        'i18n!faostat_ui_menu/nls/translate',
        'globals/Common',
        'underscore',
        'amplify',
        'chaplin'], function ($, log, C, ROUTE, CB, Handlebars, templates, i18nLabels, Common, _) {

    'use strict';

    var s = {

        NAVBAR_COLLAPSE: ".navbar-collapse",


    },
    defaultConfig = {

    };

    function MENU() {
        return this;
    }

    MENU.prototype.init = function (config) {

        /* Extend default configuration. */
        this.o = $.extend(true, {}, defaultConfig, config);

        this.o.lang = Common.getLocale();

        this.$MENU = $(this.o.container);

        /* Load template. */
        var source = $(templates).filter('#faostat_ui_menu_structure').html(),
            t = Handlebars.compile(source),
            d;

        d = {
            home: i18nLabels.home,
            home_link: '#' + Common.getURI(ROUTE.HOME),
            browse: i18nLabels.browse,
            download: i18nLabels.download,
            compare: i18nLabels.compare,
            indicators: i18nLabels.indicators,
            indicators_link:  '#' + Common.getURI(ROUTE.INDICATORS),
            compare_link: '#' + Common.getURI(ROUTE.COMPARE),
            search_data: i18nLabels.search_data,
            //mes: i18nLabels.mes,
            //mes_link: '#' + Common.getURI(ROUTE.METHODOLOGIES),
            definitions_and_standards: i18nLabels.definitions_and_standards,
            definitions_and_standards_link: '#' + Common.getURI(ROUTE.DEFINITIONS),
            faq: i18nLabels.faq,
            faq_link: '#' + Common.getURI(ROUTE.FAQ),
            data: i18nLabels.data,
            data_link: '#' + Common.getURI(ROUTE.DATA),
            search_placeholder: i18nLabels.search_placeholder,
            country_indicators_link: '#' + Common.getURI(ROUTE.BROWSE_BY_COUNTRY),
            country_indicators: i18nLabels.country_indicators,
            faostat: i18nLabels.faostat,
            //infographics: '#' + Common.getURI(ROUTE.INFOGRAPHICS)
        };

        this.$MENU.html(t(d));

    };

    MENU.prototype.collapse = function() {

        this.$MENU.find(s.NAVBAR_COLLAPSE).collapse('hide');

    };

    MENU.prototype.select = function(active) {

        // reset selection
        this.$MENU.find('li.active').removeClass('active');
        // hack for home icon selection that is not a <li>.
        this.$MENU.find('a.active').removeClass('active');

        if (active) {
            this.$MENU.find('li[data-role="fs-menu-' + active + '"] ').addClass("active");
            this.$MENU.find('a[data-role="fs-menu-' + active + '"] ').addClass("active");
        } else {
            if (active) {
                this.$MENU.find('li[data-role="fs-menu-' + active+ '"] ').addClass("active");
                this.$MENU.find('a[data-role="fs-menu-' + active+ '"] ').addClass("active");
            }
        }

    };

    return MENU;

});