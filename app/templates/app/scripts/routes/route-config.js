define([
	'routes/demo-route',
	'angular.route'
], function(
	demoRoute
) {
	'use strict';

	var routeConfig = function($routeProvider) {
		$routeProvider
			.when('/demo', demoRoute)
			.otherwise({
				redirectTo: '/demo'
			});
	};

	routeConfig.$inject = ['$routeProvider'];

	return routeConfig;
});
