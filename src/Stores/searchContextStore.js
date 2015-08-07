'use strict';

var ImmutableMap = require('immutable').Map

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var actionTypes = require('../Constants/actionTypes.js');

/*

Interface searchContext{
    direction: 'GIVE' | 'NEED',
    what: string,
    where: {
        place: string
        distance: number
    }
}

*/

var _searchContext = new ImmutableMap();

var searchContextStore = Object.assign({}, EventEmitter.prototype, {

    events: Object.freeze({
        
    }),
    
    get: function(){
        return _searchContext;
    }

});

searchContextStore.dispatchToken = dispatcher.register(function(action) {
    
    switch(action.type) {

        case actionTypes.UPDATE_SEARCH_CONTEXT:
            ['direction', 'what', 'where'].forEach(function(k){
                if(action.delta[k] !== undefined)
                    _searchContext = _searchContext.set(k, action.delta[k]);
            });
            searchContextStore.emit('search context');
            
            console.log('search context', _searchContext, JSON.stringify(_searchContext));
            
            break;

        default:
          // do nothing
    }

});

module.exports = searchContextStore;
