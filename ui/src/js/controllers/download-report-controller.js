/*global define*/
define([
    'controllers/base/controller',
    'views/download-view'
], function (Controller, View) {

    'use strict';

    return Controller.extend({

        show: function (params, section) {
            this.view = new View({
                region: 'main',
                section: section,
                code: params.code.toUpperCase()
            });
        },

        show_report: function (params) {
            this.show(params, 'report');
        }

    });

});
