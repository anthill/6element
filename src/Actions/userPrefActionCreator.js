'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var actionTypes = require('../Constants/actionTypes.js');

var localAPIUtils = require('../Utils/localAPIUtils.js');

module.exports = {

    load: function(userPrefs) {
        dispatcher.dispatch({
            type: actionTypes.LOAD_USER_PREFS,
            userPrefs: userPrefs
        });
    },

    update: function(delta) {
        dispatcher.dispatch({
            type: actionTypes.UPDATE_USER_PREFS,
            delta: delta
        });

        localAPIUtils.updateUserPrefs(delta);
    }

};
