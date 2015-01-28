'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('gulp-angular-requirejs:app', function () {
	var appname = 'testapp';

	var basedir = process.cwd();

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), appname))
			.withOptions({ 'skip-install': true })
			/*.withPrompts({
			 someOption: true
			 })*/
			.on('end', done);
	});

	after(function() {
		process.chdir(basedir);
	});

	it('creates main files', function () {
		assert.file([
			'gulpfile.js',
			'package.json',
			'bower.json',
			'.bowerrc',
			'.gitignore',
			'.gitattributes',
			'.travis.yml',
			'.editorconfig',
			'.jshintrc'
		]);
	});

	it('creates app files', function () {
		assert.file([
			'app/images/loader.gif',
			'app/scripts/config/dev-config.js',
			'app/scripts/config/prod-config.js',
			'app/scripts/directives/app-title.js',
			'app/scripts/logging/console-logger.js',
			'app/scripts/util/set-loading.js',
			'app/scripts/app.js',
			'app/scripts/main.js'
		]);

		assert.file([
			'app/partials/title.html',
			'app/index.html'
		]);
	});

	it('creates test files', function () {
		assert.file([
			'test/karma.conf.js',
			'test/protractor.conf.js',
			'test/test-main.js'
		]);

		assert.file([
			'test/e2e/main-spec.js',
			'test/unit/directives/app-title-spec.js',
			'test/unit/app-spec.js'
		]);
	});

	it('substitutes appname', function () {
		var regex = new RegExp(appname);
		var checkFiles = function(files) {
			var filePairs = [];
			files.forEach(function(file) {
				filePairs.push([file, regex]);
			});
			assert.fileContent(filePairs);
		}.bind(this);

		checkFiles([
			'bower.json',
			'package.json',
			'app/partials/title.html',
			'app/index.html',
			'test/e2e/main-spec.js',
			'test/unit/directives/app-title-spec.js',
			'test/unit/app-spec.js'
		]);
	});
});
