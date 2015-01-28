'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');

		this.templateAppResource = function(path) {
			this.template(path, path.substring(1));
		}.bind(this);
	},

	prompting: function () {
		//var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the tiptop' + chalk.red('Gulp-Angular-RequireJS') + ' generator!'
		));

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
