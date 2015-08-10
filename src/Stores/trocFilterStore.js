'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');

var actionTypes = require('../Constants/actionTypes.js');

var CHANGE_EVENT = 'change';

var _filterState = {
    directions: new Immutable.Set(['NEED', 'GIVE'])
};

/*
    {
        directions: Set() NEED / GIVE,
        trocStatus: DRAFT / PENDING / ONGOING / ACCEPTED / FULFILLED / CANCELED,
        keywords: Set(string)
    }
*/

function _makeFilterByDirections(directionSet){

    return function(troc){
        return directionSet.has(troc.direction);
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

    getFilterState: function(){
        return _filterState;
    },

    getFilterFunctions: function(){
    
        var filterMap = new Map();

        Object.keys(_filterState).forEach(function(key){

            var value = _filterState[key];

            if (value) // only works for directions for now
                filterMap.set(key, _makeFilterByDirections(value));
        });
    
        return filterMap;
    }

});

TrocFilterStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case actionTypes.APPLY_TROC_FILTERS:
            if (action.filter === 'directions'){
                var directionSet = _filterState[action.filter];

                console.log('BORDEL', _filterState);

                if (directionSet.has(action.value))
                    directionSet = directionSet.delete(action.value);
                else
                    directionSet = directionSet.add(action.value);

                _filterState[action.filter] = directionSet;
                console.log('filter state', _filterState.directions);
                TrocFilterStore.emitChange();
            }
            
            break;

        default:
          // do nothing
    }

});

module.exports = TrocFilterStore;
