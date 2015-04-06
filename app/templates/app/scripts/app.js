define(function(require) {
	'use strict';

	var angular = require('angular'),
		demoModule = require('demo/demo-module'),
		routeConfig = require('routes/route-config');

	require('angular.route');

	var app = angular.module('<%= appname %>', [
		'ngRoute',
		demoModule.name
	]);

	app.config(routeConfig);

	return app;
});
