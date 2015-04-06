'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require('underscore.string/slugify');

module.exports = yeoman.generators.Base.extend({
	initializing: function() {
		this.pkg = require('../package.json');

		this.templateAppResource = function templateAppResource(path) {
			this.template(path, path.substring(1));
		}.bind(this);

		this.packagename = slugify(this.appname);
	},

	prompting: function() {
		var done = this.async();

		if (!this.options['skip-welcome-message']) {
			this.log(yosay());
			this.log(
				chalk.magenta(
					'Out of the box I include Gulp, AngularJS, RequireJS, LESS, and Bootstrap.' +
					'\n'
				)
			);
		}

		var prompts = [{
			type: 'confirm',
			name: 'includeModernizr',
			message: 'Would you like to include Modernizr?',
			default: false
		 }, {
			name: 'githubUser',
			message: 'Would you mind telling me the username or organization on GitHub that this app will reside in?',
			default: 'someuser'
		}];

		this.prompt(prompts, function(props) {
			this.includeModernizr = props.includeModernizr;
			this.githubUser = props.githubUser;
			done();
		}.bind(this));
	},

	writing: {
		readme: function() {
			this.template('README.md');
		},

		gulpfile: function() {
			this.template('gulpfile.js');
		},

		packageJson: function() {
			this.template('_package.json', 'package.json');
		},

		bower: function() {
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

		projectfiles: function() {
			this.copy('editorconfig', '.editorconfig');
			this.copy('jscsrc', '.jscsrc');
			this.copy('jshintrc', '.jshintrc');
		},

		app: function() {
			this.directory('app');
			this.templateAppResource('_app/partials/directives/title.html');
			this.templateAppResource('_app/index.html');
		},

		test: function() {
			this.directory('test');
			this.templateAppResource('_test/e2e/demo-spec.js');
			this.templateAppResource('_test/e2e/main-spec.js');
			this.templateAppResource('_test/unit/demo/app-title-spec.js');
			this.templateAppResource('_test/unit/app-spec.js');
		}
	},

	install: function() {
		var skipInstall = this.options['skip-install'];

		this.installDependencies({
			bower: false,
			skipInstall: skipInstall,
			callback: function() {
				if (!skipInstall) {
					this.spawnCommand('npm', ['run', 'update-webdriver']);
				}
			}.bind(this)
		});
	}
});
