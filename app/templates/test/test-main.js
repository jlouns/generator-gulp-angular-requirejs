'use strict';

var allTestFiles = ['angular.mocks'];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
	return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
	if (TEST_REGEXP.test(file)) {
		// Normalize paths to RequireJS module names.
		allTestFiles.push(pathToModule(file));
	}
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base/app/scripts',

	paths: {
		'angular': '../lib/bower/angular/angular',
		'jquery': '../lib/bower/jquery/dist/jquery',
		'bootstrap': '../lib/bower/bootstrap/dist/js/bootstrap',
		'underscore': '../lib/bower/lodash/dist/lodash',

		'log': './logging/console-logger',

		'text': '../lib/bower/requirejs-text/text',

		'partials': '../partials',

		'test': '../../test',

		'angular.mocks': '../lib/bower/angular-mocks/angular-mocks'
	},

	shim: {
		'angular' : {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular.mocks' : {
			deps: ['angular'],
			exports: 'angular.mock'
		},
		'bootstrap' : ['jquery']
	},

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});
