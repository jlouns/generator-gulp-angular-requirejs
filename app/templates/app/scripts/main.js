require([
	'angular',
	'app',
	'util/set-loading',
	'bootstrap'
], function(
	angular,
	app,
	setLoading
) {
	'use strict';

	angular.bootstrap(document, [app.name]);

	setLoading(false);
});
