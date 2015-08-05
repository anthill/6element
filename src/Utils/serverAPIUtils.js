'use strict';

// var fs = require('fs');

// ACTIONS
var loadActionCreator = require('../Actions/loadActionCreator.js');
var makeMap = require('./utils.js').makeMap;

// i couldn't use RC_FILE as the require parameter :/
// var RC_FILE = '../../data/rcs.json';
var recyclingCenters = require('../../data/rcs.json');
var fakeData = require('../../fake_src/fakeTrocGenerator.js');

module.exports = {

    loadRCs: function(){
        var recyclingCenterMap = makeMap(recyclingCenters, 'id');
        loadActionCreator.loadRecyclingCenters(recyclingCenterMap);
    },

    loadTrocs: function(){
        var trocMap = makeMap(fakeData.trocs, 'id');
        var adMap = makeMap(fakeData.ads, 'id');
        var userMap = makeMap(fakeData.users, 'id');

        loadActionCreator.loadTrocs(trocMap);
        loadActionCreator.loadAds(adMap);
        loadActionCreator.loadUsers(userMap);
    }
};
