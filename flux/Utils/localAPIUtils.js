'use strict';

// var fs = require('fs');

// ACTIONS
var loadActionCreator = require('../Actions/loadActionCreator.js');

// i couldn't use USER_PREF_FILE as the require parameter :/
// var USER_PREF_FILE = '../../data/userPrefs.json';
var userPrefs = require('../../data/userPrefs.json');

// var DISPLAY_STATE_FILE = '../../data/displayState.json';
var displayState = require('../../data/displayState.json');

module.exports = {

    loadUserPrefs: function(){
        userPrefs.favoriteRCs = new Set(userPrefs.favoriteRCs);
        loadActionCreator.loadUserPrefs(userPrefs);
    },

    loadDisplayState: function(){
        loadActionCreator.loadDisplayState(displayState);
    },

    saveUserPrefs: function(delta){
        // Write file on server => SERVER NEEDED
        Object.assign(userPrefs, delta);
        console.log('userPrefs', userPrefs);
        // fs.writeFile(USER_PREF_FILE, JSON.stringify(newPrefs));
    },

    saveDisplayState: function(delta){
        // Write file on server => SERVER NEEDED
        Object.assign(displayState, delta);
        console.log('displayState', displayState);
        // fs.writeFile(DISPLAY_STATE_FILE, JSON.stringify(newState));
    }
};
