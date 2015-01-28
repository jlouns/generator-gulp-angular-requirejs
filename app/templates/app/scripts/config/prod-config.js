require.config({
	baseUrl: 'scripts',

	paths: {
		'angular': '../lib/bower/angular/angular',
		'jquery': '../lib/bower/jquery/dist/jquery',
		'bootstrap': '../lib/bower/bootstrap/dist/js/bootstrap',
		'underscore': '../lib/bower/lodash/dist/lodash',

		'log': './logging/console-logger',

		'text': '../lib/bower/requirejs-text/text',

		'partials': '../partials'
	},

	shim: {
		'angular' : {
			exports: 'angular'
		},
		'bootstrap' : ['jquery']
	}
});
