'use strict';

var DemoPage = function() {
	this.get = function() {
		browser.get('/');
	};
};

describe('demo', function() {
	var demoPage = new DemoPage();

	beforeEach(function() {
		demoPage.get();
	});

	it('should load', function() {
		expect(element(by.css('app-title')).getText()).toMatch('<%= appname %>');
	});
});
