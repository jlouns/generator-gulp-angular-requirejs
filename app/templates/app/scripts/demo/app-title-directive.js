define(function(require) {
	'use strict';

	var template = require('text!partials/directives/title.html');

	var directive = function() {
		return {
			restrict: 'E',
			template: template
		};
	};

	directive.id = 'appTitle';

	return directive;
});
