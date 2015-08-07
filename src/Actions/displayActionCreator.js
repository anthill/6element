'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var K = require('../Constants/constants.js');
var actionTypes = K.actionTypes;

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

    goToScreen: function(screen){
        dispatcher.dispatch({
            type: actionTypes.GO_TO_SCREEN,
            screen: screen
        })
    },
    
    goBack: function(){
        dispatcher.dispatch({
            type: actionTypes.GO_BACK
        })
    }

};
