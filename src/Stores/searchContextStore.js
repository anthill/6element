'use strict';

var ImmutableMap = require('immutable').Map

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var currentUserStore = require('../Stores/currentUserStore');

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
        'CHANGE': 'change'
    }),
    
    get: function(){
        return _searchContext;
    },
    
    makeFilter: function(){
        // "copy" to be encapsulated by the returned function
        var thisSearchContext = _searchContext;
        var currentUser = currentUserStore.get();
        
        return function(troc){
            console.log('troc', troc, thisSearchContext);
            
            // people aren't looking for ads created by themselves
            if(troc.myAd.creator === currentUser)
                return false;
            
            // if the user needs an item, find ads which give something
            // if the user gives an item, find ads which need something
            if(troc.myAd.direction === thisSearchContext.get('direction'))
                return false;
            
            if(!troc.myAd.content.title.includes(thisSearchContext.get('what') || '') && !troc.myAd.content.text.includes(thisSearchContext.get('what') || ''))
                return false;
            
            // ignore 'where' for now
            
            return true;
        };
    }

});

searchContextStore.dispatchToken = dispatcher.register(function(action) {
    
    switch(action.type) {

        case actionTypes.UPDATE_SEARCH_CONTEXT:
            ['direction', 'what', 'where'].forEach(function(k){
                if(action.delta[k] !== undefined)
                    _searchContext = _searchContext.set(k, action.delta[k]);
            });
            searchContextStore.emit(searchContextStore.events.CHANGE);
            
            console.log('search context', _searchContext, JSON.stringify(_searchContext));
            
            break;

        default:
          // do nothing
    }

});

module.exports = searchContextStore;
