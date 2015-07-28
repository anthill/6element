'use strict';

var keyMirror = require('keymirror');

module.exports = {
	
	tabTypes: keyMirror({
		RC_DETAIL: null,
		MAP: null
	}),

	actionTypes: keyMirror({
		CHANGE_TAB: null
	})
};
