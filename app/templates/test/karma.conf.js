module.exports = function(config) {
	'use strict';
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '../',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'requirejs'],

		// list of files / patterns to load in the browser
		files: [
			{ pattern: 'app/scripts/**/*.js', included: false },
			{ pattern: 'app/lib/**/*.js', included: false },
			{ pattern: 'app/partials/**/*.html', included: false },
			{ pattern: 'test/unit/**/*.js', included: false },
			'test/test-main.js'
		],

		// list of files to exclude
		exclude: [
			'app/scripts/config/*.js',
			'app/scripts/main.js'
		],

		preprocessors: {
			'app/scripts/**/*.js': ['coverage']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'],

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	});
};
