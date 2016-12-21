/*global define, console, amplify */
define([
        'jquery',
        'loglevel',
        'config/Events',
        'config/Analytics',
        //'fs-m-v/config/Config',
        'text!fs-m-v/html/templates.hbs',
        'i18n!fs-m-v/nls/translate',
        'handlebars',
        'underscore',
        'q',
        'faostatapiclient',
        //'jspdf',
        'amplify'

    ],
    function ($, log, E, A, templates, i18nLabels, Handlebars, _, Q, API
             // jsPDF
    ) {

        'use strict';

        var s = {

                MODAL: '#fs-metadata-modal',
                MODAL_METADATA_CONTAINER: '[data-role="metadata"]',
                EXPORT_METADATA: '[data-role="export"]'

            },
            defaultOptions = {

                /* lang: 'en',
                  code: 'QC',
               */
                addHeader: true,
                modal: false,

                metadata_sections: {
                    description: "3.1",
                    contacts: "1.3",
                    organization: "1.1"
                }

            };

        function MetadataViewer(config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            log.info("MetadataViewer.init; o:", this.o);

            return this;
        }

        MetadataViewer.prototype.render = function (config) {

            this.initVariables();
            this.initComponents();
            this.bindEventListeners();

        };

        MetadataViewer.prototype.initVariables = function () {

            this.$CONTAINER = $(this.o.container);

        };

        MetadataViewer.prototype.initComponents = function () {

            // if container is not defined go in any case modal
            if( this.o.modal || this.$CONTAINER.length <= 0 ) {

                this.showModal();

            }
            else {

                this.createMetadataContainer();

            }

        };

        MetadataViewer.prototype._getMetadata = function () {

            return Q(API.metadata({
                domain_code: this.o.code
            }));

        };

        MetadataViewer.prototype.createMetadataContainer = function () {

            var self = this;

            this._getMetadata().then(function(d) {

                // Check based on the service result
                if ( d !== undefined && d !== null && d.data.length > 0) {

                    self.createMetadataViewer(d);

                } else {

                    self.noDataAvailablePreview();

                }

            }).fail(function() {

                self.noDataAvailablePreview();

            });

        };

        MetadataViewer.prototype.createMetadataViewer = function (d) {

            var data = d.data,
                metadata = {},
                self = this;

            // grouping  by group_code
            var groups = _.groupBy(data, 'metadata_group_code');

            _.each(groups, function(g) {

                _.each(g, function(m) {

                    if (!metadata.hasOwnProperty(m.metadata_group_code)) {
                        metadata[m.metadata_group_code] = {
                            code: m.metadata_group_code,
                            label: m.metadata_group_label,
                            subsections: []
                        };
                    }

                    metadata[m.metadata_group_code].subsections.push({
                        code: m.metadata_code,
                        label: m.metadata_label,
                        text: m.metadata_text
                    });

                });
            });

            // caching metadata (used in export)
            this.metadata = metadata;

            // rendering
            //log.info(sections)

            var html = $(templates).filter('#content').html();
            var t = Handlebars.compile(html);

            this.$CONTAINER.html(t(
                $.extend(true, {},
                    i18nLabels,
                    {
                        data: metadata,
                        addHeader: this.o.addHeader
                    })
            ));

            // enable export
            self.enableExport();

        };

        MetadataViewer.prototype.noDataAvailablePreview = function () {

            var html = $(templates).filter('#no_data_available').html(),
                t = Handlebars.compile(html);

            this.$CONTAINER.html(t(i18nLabels));

        };

        MetadataViewer.prototype.showModal = function () {

            this.$MODAL = $(s.MODAL);

            // initialize modal template if doesn't exists
            if (this.$MODAL.length <= 0) {

                var html = $(templates).filter('#modal').html(),
                    t = Handlebars.compile(html);

                $('body').append(t(i18nLabels));

                this.$MODAL = $(s.MODAL);

            }

            // create metadata container in the modal
            this.o.addHeader = false; // TODO: force header at false?
            this.$CONTAINER = this.$MODAL.find(s.MODAL_METADATA_CONTAINER);
            this.createMetadataContainer();

            // show modal
            this.$MODAL.modal({keyboard: true});

        };

        MetadataViewer.prototype.enableExport = function() {

            var self = this;

            // TODO: make it nicer
            this.$EXPORT_METADATA = this.$CONTAINER.find(s.EXPORT_METADATA);
            if( this.$EXPORT_METADATA.length <= 0) {
                this.$EXPORT_METADATA = this.$MODAL.find(s.EXPORT_METADATA);
            }

            this.$EXPORT_METADATA.off('click');
            this.$EXPORT_METADATA.on('click', function() {

                log.info("export metadata", self.sectors);

                // TODO: move the logic from here

                var d = [];

                // TODO: multilanguage
                d.push(["Subsection Code", "Section", "Subsection", "Metadata"]);

                _.each(self.metadata, function(s, index) {
                    if(s !== undefined) {
                        if (s.hasOwnProperty('label')) {
                            var sector = s.label;
                            _.each(s.subsections, function (sub) {
                                d.push([sub.code, sector, sub.label, sub.text || ""]);
                            });
                        }
                    }

                });

                // TODO: leave it here or use the Common FAOSTAT Export?
                amplify.publish(E.EXPORT_MATRIX_DATA, { data: d });

                // log event to analytics
                self._analyticsDownloadCSV();


                /*

                var doc = new jsPDF();
                var specialElementHandlers = {
                    '#editor': function(element, renderer){
                        return true;
                    }
                };
                doc.fromHTML(self.$CONTAINER.get(0));
                doc.save('Test.pdf');

                */

            });

        };

        MetadataViewer.prototype._getSection = function(data, section) {

            var m = _.find(data, function(v) {
                return v.metadata_code === section;
            });

            return m;

        };

        MetadataViewer.prototype.getDescription = function() {

            var deferred = Q.defer(),
                self = this;

            this._getMetadata().then(function(d) {

                var metadata_section = self.o.metadata_sections.description,
                    m = self._getSection(d.data, metadata_section);

                if ( m ) {

                    deferred.resolve({
                        code: [metadata_section],
                        text: m.metadata_text,
                        fullSection: m
                    });

                } else {

                    deferred.resolve();

                }

            }).fail(function(e){

                log.error("MetadataViewer.getDescription; error:", e);

                // TODO: check the error
                deferred.reject(new Error(e));

            });

            return deferred.promise;
            
        };

        MetadataViewer.prototype.getContacts = function() {

            var deferred = Q.defer(),
                self = this;

            this._getMetadata().then(function(d) {

                var metadata_section = self.o.metadata_sections.contacts,
                    m = self._getSection(d.data, metadata_section);

                if ( m ) {

                    deferred.resolve({
                        code: [metadata_section],
                        text: m.metadata_text,
                        fullSection: m
                    });

                } else {

                    deferred.resolve();

                }

            }).fail(function(e){

                log.error("MetadataViewer.getContacts; error:", e);

                // TODO: check the error
                deferred.reject(new Error(e));

            });

            return deferred.promise;

        };

        MetadataViewer.prototype.getOrganization = function() {

            var deferred = Q.defer(),
                self = this;

            this._getMetadata().then(function(d) {

                var metadata_section = self.o.metadata_sections.organization,
                    m = self._getSection(d.data, metadata_section);

                if ( m ) {

                    deferred.resolve({
                        code: [metadata_section],
                        text: m.metadata_text,
                        fullSection: m
                    });

                } else {

                    deferred.resolve();

                }

            }).fail(function(e){

                log.error("MetadataViewer.getOrganization; error:", e);

                // TODO: check the error
                deferred.reject(new Error(e));

            });

            return deferred.promise;

        };

        MetadataViewer.prototype._analyticsDownloadCSV = function () {
            
            // this could be a double counting in the events. but will track the metadata downlaoded
            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: A.metadata.download_csv.category,
                action: A.metadata.download_csv.action,
                label: this.o.code
            });

        };

        MetadataViewer.prototype.bindEventListeners = function () {

        };

        MetadataViewer.prototype.unbindEventListeners = function () {

            if (this.$EXPORT_METADATA) {
                this.$EXPORT_METADATA.off('click');
            }

        };

        MetadataViewer.prototype.destroy = function () {

            this.unbindEventListeners();

            log.warn('MetadataViewer.destroy; handle destroy');

        };

        return MetadataViewer;
    });