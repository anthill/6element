'use strict';

var dispatcher = require('../dispatcher/dispatcher.js');
var constants = require('../constants/constants.js');
var actionTypes = constants.actionTypes;

module.exports = {

    changeTab: function(selectedTab) {
        dispatcher.dispatch({
            type: actionTypes.CHANGE_TAB,
            selectedTab: selectedTab
        });
    }

};
