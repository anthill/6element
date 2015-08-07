'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var actionTypes = require('../Constants/actionTypes.js');

var CHANGE_EVENT = 'change';

var _prefs = {
    favoriteRCs: undefined
};

function _updateFavoriteRCs(id){
    if (_prefs.favoriteRCs.has(id))
        _prefs.favoriteRCs.delete(id);
    else
        _prefs.favoriteRCs.add(id);
}

var UserPrefStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

});

UserPrefStore.dispatchToken = dispatcher.register(function(action) {

    // Maybe dispatcher.waitFor(displayedItemStore) is needed here => check needed

    switch(action.type) {

        case actionTypes.UPDATE_FAVORITE_RCS:
            _updateFavoriteRCs(action.RCId);
            UserPrefStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = UserPrefStore;
