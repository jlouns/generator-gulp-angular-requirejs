define(['jquery'], function($) {
	'use strict';

	return function(loading) {
		var loadingIndicator = $('.loading-indicator');

		if(loading) {
			loadingIndicator.show();
		} else {
			loadingIndicator.hide();
		}
	};
});
