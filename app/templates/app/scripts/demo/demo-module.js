define(function(require) {
	'use strict';

	var angular = require('angular'),
		appTitleDirective = require('./app-title-directive'),
		demoRouteConfig = require('./demo-route-config');

	require('angular.route');

	var module = angular.module('appDemo', ['ngRoute']);

	module.directive(appTitleDirective.id, appTitleDirective);

	module.config(demoRouteConfig);

	return module;
});
