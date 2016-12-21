/*global define*/
define([
        'jquery',
        'handlebars',
        'loglevel',
        //'text!fx-m-c/html/templates/base_template.hbs'
        'text!fx-m-c/html/templates/custom_template.hbs',
        'i18n!fx-m-c/nls/translate'
    ],
    function ($, Handlebars, log, template, i18n) {

        'use strict';

        var defaultOptions = {
            s: {
                CONTENT: '[data-role="content"]'
            }
        };

        function Base_template() {
            $.extend(true, this, defaultOptions);
        }

        Base_template.prototype.render = function (config) {
            $.extend(true, this, config);

            if (this._validateInput() === true) {
                this._initVariable();
                this._injectTemplate();
            } else {
                //console.error(this.errors);
                throw new Error("FENIX Map creator has not a valid configuration");
            }
        };

        Base_template.prototype._injectTemplate = function () {

            var t = Handlebars.compile(template);
            this.$container.html(t($.extend({}, true, i18n, this.template || {})));

        };

        Base_template.prototype.noDataAvailable = function () {
            // TODO: fix it the multilanguage and hardcoded style.
            this.$container.find(this.s.CONTENT).html("<div style='padding: 15px;'>" + i18n.no_data_available + "</div>");
            this.$container.find(this.s.CONTENT).height('auto');
        };

        Base_template.prototype._initVariable = function () {
            this.$container = $(this.container);
        };

        Base_template.prototype._validateInput = function () {

            this.errors = {};

            if (!this.hasOwnProperty("container")) {
                this.errors['container'] = "'container' attribute not present";
            }

            //Model
/*            if (!this.hasOwnProperty("model")) {
                this.errors['model'] = "'model' attribute not present.";
            }

            if (typeof this.model !== 'object') {
                this.errors['model'] = "'model' is not an object.";
            }*/

            return (Object.keys(this.errors).length === 0);
        };

        return Base_template;
    });