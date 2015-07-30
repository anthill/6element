'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var constants = require('../Constants/constants.js');
var displayActionTypes = constants.actionTypes.displayState;

var CHANGE_EVENT = 'change';

var _displayed = {};

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

    getDisplayedTab: function() {
        return _displayed.activeTab;
    },

    getAll: function() {
        return _displayed;
    }

});

DisplayedItemStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case displayActionTypes.LOAD_DISPLAY:
            _displayed = action.displayState;
            console.log('display', _displayed);
            DisplayedItemStore.emitChange();
            break;

        case displayActionTypes.CHANGE_TAB:
            _displayed.activeTab = action.selectedTab;
            DisplayedItemStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = DisplayedItemStore;
