'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var constants = require('../Constants/constants.js');

var actionTypes = constants.actionTypes;

module.exports = {
    loadDisplayState: function(displayState) {
        dispatcher.dispatch({
            type: actionTypes.LOAD_DISPLAY,
            displayState: displayState
        });
    },

    loadUserPrefs: function(userPrefs){
        dispatcher.dispatch({
            type: actionTypes.LOAD_USER_PREFS,
            userPrefs: userPrefs
        });
    },

    loadRecyclingCenters: function(recyclingCenterMap){
        dispatcher.dispatch({
            type: actionTypes.LOAD_RCS,
            recyclingCenterMap: recyclingCenterMap
        });
    }

};
