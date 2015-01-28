define(['app'],function (app) {
	'use strict';

	describe('app', function() {
		it('should create an angular module', function() {
			expect(app.name).toBe('<%= appname %>');
		});
	});
});
