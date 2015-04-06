/*global before, after, it */
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

module.exports = function(includeModernizr) {
	var appdir = 'test-app',
		appname = 'test app',
		packagename = 'test-app';

	var basedir = process.cwd();

	before(function(done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), appdir))
			.withOptions({'skip-install': true})
			.withPrompts({
				includeModernizr: includeModernizr
			})
			.on('end', done);
	});

	after(function() {
		process.chdir(basedir);
	});

	it('creates main files', function() {
		assert.file([
			'README.md',
			'gulpfile.js',
			'package.json',
			'bower.json',
			'.bowerrc',
			'.gitignore',
			'.gitattributes',
			'.travis.yml',
			'.editorconfig',
			'.jscsrc',
			'.jshintrc'
		]);
	});

	it('creates app files', function() {
		assert.file([
			'app/images/loader.gif',
			'app/scripts/config/dev-config.js',
			'app/scripts/config/prod-config.js',
			'app/scripts/demo/app-title-directive.js',
			'app/scripts/demo/demo-module.js',
			'app/scripts/demo/demo-route.js',
			'app/scripts/demo/demo-route-config.js',
			'app/scripts/logging/console-logger.js',
			'app/scripts/routes/route-config.js',
			'app/scripts/app.js',
			'app/scripts/main.js'
		]);

		assert.file([
			'app/partials/directives/title.html',
			'app/partials/views/demo.html',
			'app/index.html'
		]);
	});

	it('creates test files', function() {
		assert.file([
			'test/karma.conf.js',
			'test/protractor.conf.js',
			'test/test-main.js'
		]);

		assert.file([
			'test/e2e/demo-spec.js',
			'test/e2e/main-spec.js',
			'test/unit/demo/app-title-spec.js',
			'test/unit/app-spec.js'
		]);
	});

	it('formats readme', function() {
		assert.fileContent('README.md', new RegExp(packagename));
		assert.fileContent('README.md', /someuser/);
	});

	it('substitutes appname and packagename', function() {
		var checkFiles = function(files, regex) {
			var filePairs = [];
			files.forEach(function(file) {
				filePairs.push([file, regex]);
			});
			assert.fileContent(filePairs);
		};

		checkFiles([
			'bower.json',
			'package.json'
		], new RegExp(packagename));

		checkFiles([
			'app/partials/directives/title.html',
			'app/index.html',
			'test/e2e/demo-spec.js',
			'test/e2e/main-spec.js',
			'test/unit/demo/app-title-spec.js',
			'test/unit/app-spec.js'
		], new RegExp(appname));
	});

	it('handles modernizr', function() {
		var assertion;
		if(includeModernizr) {
			assertion = assert.fileContent;
		} else {
			assertion = assert.noFileContent;
		}

		assertion('bower.json', /modernizr/);
		assertion('app/index.html', /modernizr/);
		assertion('app/index.html', /class="no-js"/);
	});
};
