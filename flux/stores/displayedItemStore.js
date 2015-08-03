'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var constants = require('../Constants/constants.js');
var actionTypes = constants.actionTypes;

var CHANGE_EVENT = 'change';

var _displayed = {
    activeTab: undefined, // string
    activeRC: undefined, // integer
    isRCListOpen: undefined // boolean
};

var DisplayedItemStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    isRCListOpen: function(){
        return _displayed.isRCListOpen;
    },

    getDisplayedTab: function() {
        return _displayed.activeTab;
    },

    getAll: function() {
        return _displayed;
    }

});

DisplayedItemStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case actionTypes.LOAD_DISPLAY:
            _displayed = action.displayState;
            console.log('display', _displayed);
            DisplayedItemStore.emitChange();
            break;

        case actionTypes.CHANGE_TAB:
            _displayed.activeTab = action.selectedTab;
            DisplayedItemStore.emitChange();
            break;

        case actionTypes.TOGGLE_RC_LIST:
            _displayed.isRCListOpen = !_displayed.isRCListOpen;
            DisplayedItemStore.emitChange();
            break;

        case actionTypes.CHANGE_RC:
            _displayed.isRCListOpen = false;
            DisplayedItemStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = DisplayedItemStore;
