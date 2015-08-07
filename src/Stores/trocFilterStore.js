'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var actionTypes = require('../Constants/actionTypes.js');

var CHANGE_EVENT = 'change';

var _filterState = {};

/*
    {
        direction: NEED / GIVE,
        trocStatus: DRAFT / PENDING / ONGOING / ACCEPTED / FULFILLED / CANCELED,
        keywords: Set(string)
    }
*/

function _makeFilterByDirection(direction){

    return function(troc){
        return troc.direction === direction;
    };

}

// function _filterByStatus(status){

    //     return function(troc){
    //         return troc.trocStatus === status;
    //     };
    // }

    // function _filterByKeywords(){

    //     return function(){
    //         // TO DO
    //     };
    // }

var TrocFilterStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getCurrentFilters: function(){
    
        var filterMap = new Map();

        Object.keys(_filterState).forEach(function(key){

            var value = _filterState[key];

            if (value)
                filterMap.set(key, _makeFilterByDirection(value));
        });
    
        return filterMap;
    }

});

TrocFilterStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case actionTypes.APPLY_TROC_FILTERS:
            _filterState[action.filter] = action.value;
            console.log('filter state', _filterState);
            TrocFilterStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = TrocFilterStore;
