'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var constants = require('../Constants/constants.js');
var actionTypes = constants.actionTypes;

var CHANGE_EVENT = 'change';

var _trocMap; // Map: id -> Troc
/*

Interface Troc
{
    id: string,
    links: [{
        userId: integer,
        adId: integer,
        state: POTENTIAL / INTERESTED / CHOSEN / REFUSED / DISCARDED / COMPLETED 
    }],
    direction: GIVE / NEED
    state: DRAFT / PENDING / ONGOING / ACCEPTED / CLOSED / CANCELED
}

*/

var TrocStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id){
        return _trocMap.get(id);
    },

    getAll: function(){
        return _trocMap;
    }

});

TrocStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case actionTypes.LOAD_TROCS:
            _trocMap = action.trocMap;
            TrocStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = TrocStore;
