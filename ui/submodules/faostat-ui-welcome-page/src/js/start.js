/*global define, amplify */
define([
    'jquery',
    'loglevel',
    'config/Routes',
    'config/Events',
    'handlebars',
    'text!faostat_ui_welcome_page/html/templates.hbs',
    //'i18n!faostat_ui_welcome_page/nls/translate',
    'i18n!nls/download',
    'faostatapiclient',
    'lib/download/go_to_section/go-to-section',
    'amplify'
], function ($, log, ROUTE, E, Handlebars, templates, translate, API, GoToSection) {

    'use strict';

    function WELCOME_PAGE() {

        this.s = {

            WELCOME_TEXT: '#welcome_text',
            WELCOME_SECTION: '#welcome_section'

        };

        this.CONFIG = {

            container: 'faostat_ui_welcome_page',
            domain_name: undefined,
            domain_code: undefined,
            base_url: 'http://faostat3.fao.org/faostat-documents/',

            // TODO: move to a common download section
            sections: [
                {
                    id: ROUTE.DOWNLOAD_WELCOME,
                    name: translate.about
                },
                {
                    id: ROUTE.DOWNLOAD_INTERACTIVE,
                    name: translate.interactive_download_title
                },
                {
                    id: ROUTE.DOWNLOAD_BULK,
                    name: translate.bulk_downloads_title
                },
                {
                    id: ROUTE.DOWNLOAD_METADATA,
                    name: translate.metadata_title
                }
            ]

        };

    }

    WELCOME_PAGE.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        this.$CONTAINER = ($(this.CONFIG.container).length > 0)? $(this.CONFIG.container) : $('#' + this.CONFIG.container);

        this.$CONTAINER.empty();

        amplify.publish(E.LOADING_SHOW, { container: this.$CONTAINER });

        this.render();
    };

    WELCOME_PAGE.prototype.render = function () {

        /* Variables. */
        var self = this,
            documents = [],
            i;

        /* Query DB for available files. */
        API.documents({
            domain_code: this.CONFIG.domain_code,
        }).then(function (d) {

            for (i = 0; i < d.data.length; i += 1) {

                log.info(d.data[i]);

                // TODO: this should be a "fileType" or anyway should come from a differenct place instead of an hardcoded "title" "About"
                if (d.data[i].FileTitle !== 'About') {

                    // List of documents related to the Domain
                    documents.push({
                        FileName: d.data[i].FileName,
                        FileTitle: d.data[i].FileTitle,
                        FileContent: d.data[i].FileContent,
                        base_url: self.CONFIG.base_url
                    });
                    
                } else {

                    // About section of the domain

                    amplify.publish(E.LOADING_SHOW, {container: self.s.WELCOME_TEXT});
                    $.get(self.CONFIG.base_url + d.data[i].FileName, function(response) {
                        log.info(response);
                        amplify.publish(E.LOADING_HIDE, {container: self.s.WELCOME_TEXT});
                        $(self.s.WELCOME_TEXT).html(response);
                    });

                }

            }

            self.load_template(documents);

        });

    };

    WELCOME_PAGE.prototype.load_template = function (documents) {

        amplify.publish(E.LOADING_SHOW, {container: this.s.WELCOME_TEXT});

        /* Variables. */
        var source = $(templates).filter('#faostat_ui_welcome_page_structure').html(),
            template = Handlebars.compile(source),
            hasDocuments = documents.length > 0,
            data = {
                domain_name: this.CONFIG.domain_name,
                hasDocuments: hasDocuments,
                documents: documents
                //sections: this.CONFIG.sections
            },
            html = template($.extend(true, {}, data, translate));

        /* Load main structure. */
        this.$CONTAINER.html(html);

        // add go to section
       new GoToSection().init({
           container: this.$CONTAINER.find(this.s.WELCOME_SECTION),
           domain_code: this.CONFIG.domain_code
       });

    };

    WELCOME_PAGE.prototype.dispose = function () {
        this.$CONTAINER.empty();
    };

    return WELCOME_PAGE;

});