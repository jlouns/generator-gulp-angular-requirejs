define([
	'app',
	'text!partials/title.html'
], function(
	app,
	template
) {
	'use strict';

	var directive = function() {
		return {
			restrict: 'E',
			template: template
		};
	};

	directive.id = 'appTitle';

	return directive;
});
