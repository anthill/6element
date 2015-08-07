'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var actionTypes = require('../Constants/actionTypes.js');

var CHANGE_EVENT = 'change';

var _userMap; // Map: id -> User
/*

Interface User
{
    id: integer,
    name: string
}

*/

var UserStore = Object.assign({}, EventEmitter.prototype, {

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
        return _userMap.get(id);
    },

    getAll: function(){
        return _userMap;
    }

});

UserStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case actionTypes.LOAD_USERS:
            _userMap = action.userMap;
            UserStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = UserStore;
