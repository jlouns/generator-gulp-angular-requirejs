define([
	'app',
	'text!partials/title.html'
],function (
	app,
	template
) {
	'use strict';
	describe('Title directive', function() {
		var element, scope;

		beforeEach(module(app.name));

		beforeEach(inject(function($rootScope, $compile) {
			scope = $rootScope.$new();

			element = '<app-title></app-title>';

			element = $compile(element)(scope);
			scope.$digest();
		}));

		it('should create a title heading', function() {
			expect(element.text().trim()).toBe('<%= appname %>');
			expect(element.html()).toBe(template);
		});
	});
});
