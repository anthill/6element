'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var constants = require('../Constants/constants.js');
var displayActionTypes = constants.actionTypes.displayState;

var localAPIUtils = require('../Utils/localAPIUtils.js');

module.exports = {

    changeTab: function(selectedTab) {
        dispatcher.dispatch({
            type: displayActionTypes.CHANGE_TAB,
            selectedTab: selectedTab
        });

        localAPIUtils.saveDisplayState(selectedTab);
    }

};
