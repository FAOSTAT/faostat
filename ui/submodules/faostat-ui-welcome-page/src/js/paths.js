/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_WELCOME_PAGE: 'start',
            faostat_ui_welcome_page: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});