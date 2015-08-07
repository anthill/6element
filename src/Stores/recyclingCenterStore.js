'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var actionTypes = require('../Constants/actionTypes.js');

var CHANGE_EVENT = 'change';

var _RCMap; // Map: id -> RecyclingCentersss
var _selectedID; // integer

var RecyclingCenterStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getSelected: function(){
        return _RCMap.get(_selectedID);
    },

    getAll: function(){
        return _RCMap;
    }

});

RecyclingCenterStore.dispatchToken = dispatcher.register(function(action) {
    
    switch(action.type) {

        case actionTypes.LOAD_RCS:
            _RCMap = action.recyclingCenterMap;
            console.log('rc map', _RCMap);
            RecyclingCenterStore.emitChange();
            break;

        case actionTypes.LOAD_DISPLAY:
            _selectedID = action.displayState.activeRC;
            RecyclingCenterStore.emitChange();
            break;

        case actionTypes.CHANGE_RC:
            _selectedID = action.selectedRC;
            console.log('selected RC', _selectedID);
            RecyclingCenterStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = RecyclingCenterStore;
