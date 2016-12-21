/*

USAGE:
	jsonForm('#form-contact', 'schema.contact.json');

	//new dom element
	var form$ = $('<form>').prependTo('body');
	
	jsonForm(form$, 'schema.contact.json');

*/
define([
	'require','jquery','underscore','handlebars','jsoneditor', 'bootstrap-datetimepicker', 'moment',
	//'fmdTheme',
	'text!fx-common/html/jsonForm.html'
], function (require, $, _, Handlebars, JSONEditor, datetimepicker, moment,
	//FMDTheme,
	jsonFormHtml) {

	var tmplJsonForm = Handlebars.compile(jsonFormHtml);

	//PATCH json-editor template engine:
	window.Handlebars = Handlebars;
	//https://github.com/jdorn/json-editor/issues/494

/*    JSONEditor.defaults.themes.ap_dataEntry_theme = JSONEditor.AbstractTheme.extend(AP_DATAENTRY_THEME);
    var customSelector = new CustomSelector();
    JSONEditor.defaults.editors.string = JSONEditor.defaults.editors.string.extend(customSelector.custom_string_editor);
*/

	JSONEditor.defaults.themes.fenix = JSONEditor.defaults.themes.bootstrap3.extend({

	});

	JSONEditor.defaults.editors.string = JSONEditor.defaults.editors.string.extend({
		build: function() {
			
			this._super();

			if(this.options.disabled)
				this.disable();

/*			if(this.format === 'date') {
				$(this.input).attr('type','text');	//disable html5 datepicker
				$(this.input).datetimepicker({
					format: "D-MM-YYYY",
					disabledTimeIntervals: [[moment({ h: 0 }), moment({ h: 23 })]]
				});
			}*/
		},
/*		setValue: function(value, initial, from_template) {
			this._super();

			if(this.format === 'date') {
				$(this.input).data('DateTimePicker').date( new Date(parseFloat(value)) );
				this.refreshValue();
			}

			console.log(value, from_template);	
		}*/
	});

	JSONEditor.defaults.editors.object = JSONEditor.defaults.editors.object.extend({
		build: function() {

			this._super();

			if(this.options.disabled)
				this.disable();
		}
	});

/*	JSONEditor.defaults.themes.bootstrap3 = JSONEditor.defaults.themes.bootstrap3.extend({
		addInputError: function(input, html) {
			if(!input.controlgroup) return;
			input.controlgroup.className += ' has-error';
			if(!input.errmsg) {
			  input.errmsg = document.createElement('p');
			  input.errmsg.className = 'help-block errormsg';
			  input.controlgroup.appendChild(input.errmsg);
			}
			else {
			  input.errmsg.style.display = '';
			}
			$(input.errmsg).html('<span class="alert alert-danger">'+html+'</span>');
		}
	});*/

	function jsonForm(target, opts) {

		opts = opts || {};

		var self = this;

		self.target = (target instanceof jQuery) ? target : $(target);

		self.opts = _.defaults(opts, {
			template: 'handlebars',
			iconlib: 'fontawesome4',
			theme: 'bootstrap3',
			//theme:'fmd_theme',
			//TODO languages using module nls/jsoneditor_errors.js

			ajax: true,
			editable: false,
			disable_collapse: true,
			disable_edit_json: true,
			disable_properties: true,
			disable_array_reorder: true,
			
			keep_oneof_values: false,

			//for required fields
			remove_empty_properties: true,

			//show_errors: true,
			schema: _.isString(opts.schema) ? {$ref: require.toUrl(opts.schema)} : opts.schema,
			values: {},

			disabled: [],

			tmpl: {
				idform: self.target.attr('id'),
				submit: 'Save',
				reset: 'Cancel'
			},

			languages: null,

			//callbacks
			onReady: $.noop,
			onReset: $.noop,
			onChange: $.noop,
			onSubmit: $.noop
			//TODO onError	fired when inputs not valid			
		});

		if(!_.isUndefined(opts.editable))
			self.opts = _.extend(self.opts, {
				editable:              opts.editable,
				disable_collapse:     !opts.editable,
				disable_edit_json:    !opts.editable,
				disable_properties:   !opts.editable,
				disable_array_reorder:!opts.editable
			});

		if(self.opts.tmpl.languages) {
			JSONEditor.defaults.default_language = requirejs.s.contexts._.config.i18n.locale;
			JSONEditor.defaults.language = JSONEditor.defaults.default_language;
			JSONEditor.defaults.languages = self.opts.tmpl.languages;
		}

		self.target.html( tmplJsonForm(self.opts.tmpl) );

		self.$form = self.target.find('form');
		self.container = self.target.find('.form-wrapper-content')[0];
		self.editor = new JSONEditor(self.container, self.opts);

		if(!_.isEmpty(self.opts.disabled))
			_.each(self.opts.disabled, function(key) {
				self.editor.getEditor('root.'+key).disable();
			});

		self.editor.on('ready', function (e) {
		    self.emptySchema = self.editor.getValue();
		
			if(!_.isEmpty(self.opts.values))
				self.editor.setValue(self.opts.values);

			self.opts.onReady.call(self, self.editor);

			self.editor.on('change', function(e) {
				self.opts.onChange.call(self, self.editor.getValue() );
			});			
		});

		self.target.find('.form-wrapper-submit').on('click', function(e) {
			e.preventDefault();
			self.opts.onChange.call(self, self.editor.getValue() );
			self.opts.onSubmit.call(self, self.editor.getValue() );
		});

		self.target.find('.form-wrapper-reset').on('click', function(e) {
			e.preventDefault();
			
			self.reset();

			self.opts.onChange.call(self, self.editor.getValue() );
			self.opts.onReset.call(self, self.editor.getValue() );
		});

		if(self.target.is('#cat1')) {

			var key = 'ask1';

			self.editor.watch('root.'+key, function() {

				var e = self.editor.getEditor('root.'+key);
					val = e.getValue();

				console.log('watch', e, val);

				if(val=='Yes') {
					console
				}

			});
		}
	};

	jsonForm.prototype.reset = function() {

		var self = this;

		self.$form[0].reset();

		self.editor.setValue( self.emptySchema );
	};

	return jsonForm;
});