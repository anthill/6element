'use strict';

var dispatcher = require('../dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var constants = require('../constants/constants.js');
var tabTypes = constants.tabTypes;
var actionTypes = constants.actionTypes;

var CHANGE_EVENT = 'change';

var _displayed = {
    activeTab: tabTypes.RC_DETAIL,
    rcList: false
};

function _changeTab(newTab){
    _displayed.activeTab = newTab;
}

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

        case actionTypes.CHANGE_TAB:
            _changeTab(action.selectedTab);
            DisplayedItemStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = DisplayedItemStore;
