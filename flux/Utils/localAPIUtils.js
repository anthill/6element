'use strict';

var fs = require('fs');

// ACTIONS
var loadActionCreator = require('../Actions/loadActionCreator.js');

// i couldn't use USER_PREF_FILE as the require parameter :/
// var USER_PREF_FILE = '../../data/userPrefs.json';
var userPrefs = require('../../data/userPrefs.json');

// var DISPLAY_STATE_FILE = '../../data/displayState.json';
var displayState = require('../../data/displayState.json');

console.log('fs', fs);

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
        var newPrefs = Object.assign(userPrefs, delta);
        console.log('Saving user prefs', newPrefs);
        // fs.writeFile(USER_PREF_FILE, JSON.stringify(newPrefs));
    },

    saveDisplayState: function(delta){
        // Write file on server => SERVER NEEDED
        var newState = Object.assign(displayState, delta);
        console.log('Saving display', newState);
        // fs.writeFile(DISPLAY_STATE_FILE, JSON.stringify(newState));
    }
};
