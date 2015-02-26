require.config({
	baseUrl: 'scripts',

	paths: {
		'angular': '../lib/bower/angular/angular',
		'angular.route': '../lib/bower/angular-route/angular-route',

		'underscore': '../lib/bower/lodash/lodash',

		'log': 'logging/console-logger',

		'text': '../lib/bower/requirejs-text/text',

		'partials': '../partials'
	},

	shim: {
		'angular': {
			exports: 'angular'
		},
		'angular.route': ['angular']
	}
});
