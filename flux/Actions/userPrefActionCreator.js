'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var constants = require('../Constants/constants.js');
var userPrefsActionTypes = constants.actionTypes.userPrefs;

var localAPIUtils = require('../Utils/localAPIUtils.js');

module.exports = {

    load: function(userPrefs) {
        dispatcher.dispatch({
            type: userPrefsActionTypes.LOAD_USER_PREFS,
            userPrefs: userPrefs
        });
    },

    update: function(delta) {
        dispatcher.dispatch({
            type: userPrefsActionTypes.UPDATE_USER_PREFS,
            delta: delta
        });

        localAPIUtils.updateUserPrefs(delta);
    }

};
