/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('app:install-dependencies', function() {

	beforeEach(function(done) {
		helpers.testDirectory(path.join(os.tmpdir(), 'generator-install-spec'), function(err) {
			if (err) {
				return done(err);
			}

			this.generator = helpers.createGenerator('gulp-angular-requirejs:app', [
				path.join(__dirname, '../app')
			]);

			done();
		}.bind(this));
	});

	it('calls npm update-webdriver', function(done) {
		helpers.mockPrompt(this.generator, {
			includeModernizr: false
		});

		this.generator.installDependencies = function(opt) {
			opt = opt || {};
			if (opt.callback) {
				opt.callback();
			}
		};

		this.generator.spawnCommand = function(command, args) {
			assert.ok(command === 'npm', 'command should be npm');
			assert.ok(args.indexOf('run') > -1, 'command should have run arg');
			assert.ok(args.indexOf('update-webdriver') > -1, 'command should have update-webdriver arg');
		};

		this.generator.run(done);
	});

});
