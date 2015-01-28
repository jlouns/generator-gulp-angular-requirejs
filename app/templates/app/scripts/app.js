define([
	'angular',
	'directives/app-title'
], function(
	angular,
	appTitle
) {
	'use strict';
	var app = angular.module('<%= appname %>', []);

	app.directive('appTitle', appTitle);

	return app;
});
