'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var constants = require('../Constants/constants.js');
var actionTypes = constants.actionTypes;

var localAPIUtils = require('../Utils/localAPIUtils.js');

module.exports = {

    changeTab: function(selectedTab) {
        dispatcher.dispatch({
            type: actionTypes.CHANGE_TAB,
            selectedTab: selectedTab
        });

        localAPIUtils.saveDisplayState({
            activeTab: selectedTab
        });
    },

    toggleRCList: function(){
        dispatcher.dispatch({
            type: actionTypes.TOGGLE_RC_LIST
        });
    }

};
