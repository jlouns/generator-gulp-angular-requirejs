define(function(require) {
	'use strict';

	require('angular.mocks');

	var app = require('app');

	describe('app', function() {
		beforeEach(module(app.name));

		// Make sure the module is actually constructed
		beforeEach(inject(function() {}));

		it('should create an angular module', function() {
			expect(app.name).toBe('<%= appname %>');
		});
	});
});
