'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var actionTypes = require('../Constants/actionTypes.js');

var _displayed = {
    activeTab: undefined, // K.tabTypes
    activeScreen: undefined, // K.screen
    previousScreen: undefined // K.screen // a single value means we can only go one step back. URLs, the 'page' npm package and History API should be the way to go if more is needed
    // isRCListOpen: boolean
};

var DisplayedItemStore = Object.assign({}, EventEmitter.prototype, {

    events: Object.freeze({
        CHANGE_TAB: 'change tab',
        CHANGE_SCREEN: 'change screen'
    }),

    isRCListOpen: function(){
        return _displayed.isRCListOpen;
    },

    getDisplayedTab: function() {
        return _displayed.activeTab;
    },

    getActiveScreen: function() {
        return _displayed.activeScreen;
    },

    getAll: function() {
        return _displayed;
    }

});

DisplayedItemStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case actionTypes.LOAD_DISPLAY:
            _displayed = Object.assign(action.displayState, {isRCListOpen: false});
            console.log('display', _displayed);
            DisplayedItemStore.emit(DisplayedItemStore.events.CHANGE_TAB);
            break;

        case actionTypes.CHANGE_TAB:
            _displayed.activeTab = action.selectedTab;
            DisplayedItemStore.emit(DisplayedItemStore.events.CHANGE_TAB);
            break;

        case actionTypes.TOGGLE_RC_LIST:
            _displayed.isRCListOpen = !_displayed.isRCListOpen;
            DisplayedItemStore.emit(DisplayedItemStore.events.CHANGE_TAB);
            break;

        case actionTypes.CHANGE_RC:
            _displayed.isRCListOpen = false;
            DisplayedItemStore.emit(DisplayedItemStore.events.CHANGE_TAB);
            break;

        case actionTypes.GO_TO_SCREEN:
            _displayed.previousScreen = _displayed.activeScreen;
            _displayed.activeScreen = action.screen;
            DisplayedItemStore.emit(DisplayedItemStore.events.CHANGE_SCREEN);
            break;

        case actionTypes.GO_BACK:
            _displayed.activeScreen = _displayed.previousScreen;
            _displayed.previousScreen = undefined;
            DisplayedItemStore.emit(DisplayedItemStore.events.CHANGE_SCREEN);
            break;

        default:
          // do nothing
    }

});

module.exports = DisplayedItemStore;
