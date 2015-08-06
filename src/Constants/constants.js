'use strict';

var keyMirror = require('keymirror');

module.exports = {
    
    tabTypes: keyMirror({
        HOME: null,
        ACTIVITY: null,
        RECYCLING_CENTER: null,
        MY_ADS: null,
        MY_MESSAGES: null
    }),

    homeViewTypes: keyMirror({
        SEARCH_RCS: null,
        RC_DETAILS: null,
        SEARCH_ADS: null,
        POST_AD: null
    }), 

    actionTypes: keyMirror({
        LOAD_DISPLAY: null,
        CHANGE_TAB: null,
        LOAD_USER_PREFS: null,
        UPDATE_USER_PREFS: null,
        LOAD_RCS: null,
        UPDATE_RC: null,
        TOGGLE_RC_LIST: null,
        LOAD_TROCS: null,
        LOAD_ADS: null,
        LOAD_USERS: null,
        GO_TO_SCREEN: null,
        GO_BACK: null,
        UPDATE_SEARCH_CONTEXT: null
    }),

    screen: keyMirror({
        AD_POST: null,
        MAIN: null
    }),
    
    adTypes: keyMirror({
        GIVE: null,
        NEED: null
    })
};
