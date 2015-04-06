define(function(require) {
	'use strict';

	require('angular.mocks');

	var demoModule = require('demo/demo-module');

	describe('Title directive', function() {
		var element, scope;

		beforeEach(module(demoModule.name));

		beforeEach(inject(function($rootScope, $compile) {
			scope = $rootScope.$new();

			element = '<app-title></app-title>';

			element = $compile(element)(scope);
			scope.$digest();
		}));

		it('should create a title heading', function() {
			expect(element.text().trim()).toBe('<%= appname %>');
		});
	});
});
