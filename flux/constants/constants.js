'use strict';

var keyMirror = require('keymirror');

module.exports = {
	
	tabTypes: keyMirror({
		RC_DETAIL: null,
		MAP: null
	}),

	actionTypes: {
		displayState: keyMirror({
			LOAD_DISPLAY: null,
			CHANGE_TAB: null
		}),
		userPrefs: keyMirror({
			LOAD_USER_PREFS: null,
			UPDATE_USER_PREFS: null
		})
	}
};
