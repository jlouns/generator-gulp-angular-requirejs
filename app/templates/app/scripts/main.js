require([
	'angular',
	'app'
], function(
	angular,
	app
) {
	'use strict';

	angular.bootstrap(document, [app.name]);
});
