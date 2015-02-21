define([
	'angular',
	'directives/directives-module'
], function(
	angular,
	directivesModule
) {
	'use strict';

	var app = angular.module('<%= appname %>', [
		directivesModule.name
	]);

	return app;
});
