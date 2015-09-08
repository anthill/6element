'use strict';

// var fs = require('fs');

// STORES
var TrocStore = require('../Stores/trocStore.js');

// ACTIONS
var loadActions = require('../Actions/loadActions.js');
var displayState = require('../../data/displayState.json')

var makeMap = require('./utils.js').makeMap;

// var LOCALSTORAGE_AD_STORE_KEY = 'adstore';
var LOCALSTORAGE_TROC_STORE_KEY = 'trocstore';

TrocStore.addChangeListener(function(){
    _saveInLocalstorage(LOCALSTORAGE_TROC_STORE_KEY);
});

function _saveInLocalstorage(key){

    switch(key){
        case LOCALSTORAGE_TROC_STORE_KEY:
            
            var trocsFromStore = TrocStore.getAll();

            localStorage.setItem(key, JSON.stringify(trocsFromStore.toJS()));
            break;

        default:
            console.log('unknown localstorage key');
            break;
    }
    
}

function _loadFromLocalStorage(key){
    return makeMap(JSON.parse(localStorage.getItem(key)), 'id');
}

module.exports = {

    loadDisplayState: function(){
        loadActions.loadDisplayState(displayState);
    },

    loadTrocs: function(){
        var trocMap = _loadFromLocalStorage(LOCALSTORAGE_TROC_STORE_KEY);

        loadActions.loadTrocs(trocMap);
    }

};
