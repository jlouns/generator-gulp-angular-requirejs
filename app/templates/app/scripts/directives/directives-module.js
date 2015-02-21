define([
	'angular',
	'directives/app-title'
], function(
	angular,
	appTitle
) {
	'use strict';

	var directives = angular.module('appDirectives', []);

	directives.directive(appTitle.id, appTitle);

	return directives;
});
