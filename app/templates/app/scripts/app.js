define([
	'angular',
	'directives/directives-module',
	'routes/route-config',
	'angular.route'
], function(
	angular,
	directivesModule,
	routeConfig
) {
	'use strict';

	var app = angular.module('<%= appname %>', [
		'ngRoute',
		directivesModule.name
	]);

	app.config(routeConfig);

	return app;
});
