'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var constants = require('../Constants/constants.js');
var displayActionTypes = constants.actionTypes.displayState;

module.exports = {
    loadDisplayState: function(displayState) {
        dispatcher.dispatch({
            type: displayActionTypes.LOAD_DISPLAY,
            displayState: displayState
        });
    },

    loadUserPrefs: function(userPrefs){
        dispatcher.dispatch({
            type: displayActionTypes.LOAD_USER_PREFS,
            userPrefs: userPrefs
        });
    }

};
