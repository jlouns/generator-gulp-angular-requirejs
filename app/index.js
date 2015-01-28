'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require('underscore.string/slugify');

module.exports = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');

		this.templateAppResource = function(path) {
			this.template(path, path.substring(1));
		}.bind(this);

		this.packagename = slugify(this.appname);
	},

	prompting: function () {
		//var done = this.async();

		if (!this.options['skip-welcome-message']) {
			this.log(yosay());
			this.log(
				chalk.magenta(
					'Out of the box I include Gulp, AngularJS, RequireJS, LESS, and Bootstrap.' +
					'\n'
				)
			);
		}

		/*var prompts = [{
		 type: 'confirm',
		 name: 'someOption',
		 message: 'Would you like to enable this option?',
		 default: true
		 }];

		 this.prompt(prompts, function (props) {
		 this.someOption = props.someOption;

		 done();
		 }.bind(this));*/
	},

	writing: {
		gulpfile: function() {
			this.template('gulpfile.js');
		},

		packageJson: function () {
			this.template('_package.json', 'package.json');
		},

		bower: function () {
			this.template('_bower.json', 'bower.json');
			this.copy('bowerrc', '.bowerrc');
		},

		git: function() {
			this.copy('gitignore', '.gitignore');
			this.copy('gitattributes', '.gitattributes');
		},

		ci: function() {
			this.copy('travis.yml', '.travis.yml');
		},

		projectfiles: function () {
			this.copy('editorconfig', '.editorconfig');
			this.copy('jshintrc', '.jshintrc');
		},

		app: function() {
			this.directory('app');
			this.templateAppResource('_app/partials/title.html');
			this.templateAppResource('_app/index.html');
		},

		test: function() {
			this.directory('test');
			this.templateAppResource('_test/e2e/main-spec.js');
			this.templateAppResource('_test/unit/directives/app-title-spec.js');
			this.templateAppResource('_test/unit/app-spec.js');
		}
	},

	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install']
		});
	}
});
