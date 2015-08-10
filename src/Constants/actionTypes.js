'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
    // DISPLAY
    LOAD_DISPLAY: null,
    CHANGE_TAB: null,
    GO_TO_SCREEN: null,
    GO_BACK: null,
    // USER PREFS
    LOAD_USER_PREFS: null,
    UPDATE_USER_PREFS: null,
    // RECYCLING CENTERS
    LOAD_RCS: null,
    UPDATE_RC: null,
    CHANGE_RC: null,
    TOGGLE_RC_LIST: null,
    // TROCS
    CREATE_TROC: null,
    MODIFY_TROC: null,
    LOAD_TROCS: null,
    TOGGLE_PRIVACY_STATUS: null,
    REMOVE_TROC: null,
    LOAD_ADS: null,
    LOAD_USERS: null,
    CHANGE_PROPOSAL_STATUS: null,
    APPLY_TROC_FILTERS: null,
    // SEARCH
    UPDATE_SEARCH_CONTEXT: null
});
