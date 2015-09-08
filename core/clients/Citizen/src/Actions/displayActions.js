'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var actionTypes = require('../Constants/actionTypes.js');

module.exports = {

    changeTab: function(selectedTab) {
        dispatcher.dispatch({
            type: actionTypes.CHANGE_TAB,
            selectedTab: selectedTab
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
