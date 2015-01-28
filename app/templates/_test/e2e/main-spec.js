'use strict';

var Homepage = function() {
	this.get = function() {
		browser.get('/');
	};
};

describe('<%= appname %>', function() {
	describe('homepage', function() {
		var homepage = new Homepage();

		it('should load', function() {
			homepage.get();

			expect(element(by.css('app-title')).getText()).toMatch('<%= appname %>');
		});
	});
});
