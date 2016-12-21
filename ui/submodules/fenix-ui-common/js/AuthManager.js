define([
    'jquery',
    'underscore',
    'text!fx-common/config/auth_users',
    'text!fx-common/html/auth_modal.hbs',
    'bootstrap',
    'amplify'
], function ($, _, AuthUsers, template) {

    'use strict';

    var s = {
        //login
        FORM_LOGIN: '#fx-login-form',
        MODAL_LOGIN: '#fx-login-modal',
        EMAIL_LOGIN: '#fx-login-form-inputEmail',
        PASSWORD_LOGIN: '#fx-login-form-inputPassword',
        ERROR_CONTAINER_LOGIN: '#fx-login-form-error-container',
        SUBMIT_LOGIN: "#fx-login-form-submit",
        //logout
        FORM_LOGOUT: '#fx-logout-form',
        MODAL_LOGOUT: '#fx-logout-modal',
        ERROR_CONTAINER_LOGOUT: '#fx-logout-form-error-container',
        SUBMIT_LOGOUT: "#fx-logout-form-submit",
        CANCEL_LOGOUT: "#fx-logout-form-cancel",
        STORAGE_KEY: "fx.auth.user"
    };


    var defaults = {
    	storekey: s.STORAGE_KEY,
        onLogin: null,
        onLogout: null,
        modal : {
            keyboard: true,
            backdrop: true
        }
    };

    function AuthManager(opts) {
        //TODO extend defaults..
        this.opts = _.extend(defaults, opts);

        this.users = JSON.parse(AuthUsers);

        var $body = $(".fx-sandbox");

        if ($body.length > 0) {
            $body.append(template);
        } else {
            $('body').append(template);
        }

        this.initVariables();
        this.bindEventListeners();

        return this;
    }

    AuthManager.prototype.initVariables = function () {
        //login
        this.$formLogin = $(s.FORM_LOGIN);
        this.$modalLogin = $(s.MODAL_LOGIN);
        this.$emailLogin = $(s.EMAIL_LOGIN);
        this.$submitLogin = $(s.SUBMIT_LOGIN);
        this.$passwordLogin = $(s.PASSWORD_LOGIN);
        this.$errorContainerLogin = $(s.ERROR_CONTAINER_LOGIN);
        //logout
        this.$modalLogout = $(s.MODAL_LOGOUT);
        this.$submitLogout = $(s.SUBMIT_LOGOUT);
        this.$cancelLogout = $(s.CANCEL_LOGOUT);
    };

    AuthManager.prototype.bindEventListeners = function () {

        var self = this;

        //login
        amplify.subscribe('fx.menu.login', function () {
            self.$modalLogin.modal(self.opts.modal);
        });

        this.$submitLogin.on('submit', function (e) {
            e.preventDefault();
        });

        this.$submitLogin.on('click', function () {
            //if (self.$formLogin[0].checkValidity || self.$formLogin[0].checkValidity()) {
                self._authenticate();
            //}
        });

        //bind logout on fenix menu
        amplify.subscribe('fx.menu.logout', function () {
            self.$modalLogout.modal(self.opts.modal);
        });

        this.$cancelLogout.on('click', function () {
            self.$modalLogout.modal('hide');
        });
        this.$submitLogout.on('click', function () {
            self._logout();
        });
    };

    AuthManager.prototype._logout = function () {

        this._resetLoginForm();
        this.$modalLogout.modal('hide');
        amplify.store.sessionStorage(this.opts.storekey, '');
        amplify.publish('fx.auth.logout');
        if (this.opts.onLogout)
            this.opts.onLogout();
    };

    AuthManager.prototype._authenticate = function () {

        var email = this.$emailLogin.val(),
            password = this.$passwordLogin.val(),
            user = this.users[email];

        if (user && user.password === password) {
        	user.email = email;
            this._onAuthenticationSuccess(user);
        }
        else
            this._onAuthenticationError();
    };

    AuthManager.prototype._resetLoginForm = function () {
        this.$emailLogin.val('');
        this.$passwordLogin.val('');
    };

    AuthManager.prototype._onAuthenticationSuccess = function (user) {

        this._resetLoginForm();
        this.$modalLogin.modal('hide');
        amplify.store.sessionStorage(this.opts.storekey, user);
        amplify.publish('fx.auth.login', user);
        if (this.opts.onLogin)
            this.opts.onLogin(user);
    };

    AuthManager.prototype._onAuthenticationError = function () {
        //console.warn("Login fail.");
        this.$errorContainerLogin.html("Invalid login! Email and password do not match.");
    };

    AuthManager.prototype.isLogged = function () {
        return !!amplify.store.sessionStorage(this.opts.storekey);
    };

    AuthManager.prototype.getCurrentUser = function (prop) {
        return amplify.store.sessionStorage(this.opts.storekey) || false;
    };

    return AuthManager;
});