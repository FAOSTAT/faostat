define(['jquery','underscore','handlebars','amplify',
], function ($, _, Handlebars, Amplify) {

	function storeForm(opts) {
		//TODO extend defaults..

		this.opts = _.defaults(opts, {
			prefix: '',
			autosave: true,
			autosaveInterval: 4000,
			autosaveLoader: null,
			storeExpires: 0
		});

		this.storeId = _.uniqueId('storeForm-'+this.opts.prefix);
		this.storeObj = amplify.store(this.storeId) || {};
		this.storeObjLast = null;
		this.autosaveTimer = null;		
		
		if(this.opts.autosaveLoader)
			$(this.opts.autosaveLoader).css({visibility: 'hidden'});

		if(this.opts.autosave)
			this.initAutoSave();
	};

	storeForm.prototype.addSection = function(id, data) {

		this.storeObj[ id ]= data;

		this.storeSections();

		return this;
	};

	storeForm.prototype.removeSection = function(id) {
		
		if(this.storeObj.hasOwnProperty(id))
			delete this.storeObj[ id ];

		this.storeSections();

		return this;
	};

	storeForm.prototype.storeSections = function(data) {
		
		var self = this;

		if(_.isObject(data))
			this.storeObj = data;

		if(this.opts.autosaveLoader)
			$(this.opts.autosaveLoader).css({visibility: 'visible'});

		amplify.store(this.storeId, this.storeObj, {
			expires: this.opts.storeExpires
		});

		setTimeout(function() {
			if(self.opts.autosaveLoader)
				$(self.opts.autosaveLoader).css({visibility: 'hidden'});
		}, 2500);

		return this;
	};

	storeForm.prototype.cleanSections = function() {

		this.storeSections({});

		return this;
	};

	storeForm.prototype.getSections = function(id) {
		return id ? this.storeObj[id] : this.storeObj;
	};

	storeForm.prototype.initAutoSave = function() {

		var self = this;

		self.autosaveTimer = setInterval(function() {

			if(!_.isEmpty(self.storeObj) && !_.isEqual(self.storeObj, self.storeObjLast)) {
				self.storeSections();
				self.storeObjLast = _.clone(self.storeObj);
			}

		}, self.opts.autosaveInterval);

		return self;
	};

	return storeForm;
});