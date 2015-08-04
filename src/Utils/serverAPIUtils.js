'use strict';

// var fs = require('fs');

// ACTIONS
var loadActionCreator = require('../Actions/loadActionCreator.js');
var makeMap = require('./utils.js').makeMap;

// i couldn't use RC_FILE as the require parameter :/
// var RC_FILE = '../../data/rcs.json';
var recyclingCenters = require('../../data/rcs.json');
var fakeAds = require('../../data/fakeAds.json');
var fakeTrocs = require('../../data/fakeTrocs.json');
var fakeUsers = require('../../data/fakeUsers.json');

module.exports = {

    loadRCs: function(){
        var recyclingCenterMap = makeMap(recyclingCenters, 'id');
        loadActionCreator.loadRecyclingCenters(recyclingCenterMap);
    },

    loadTrocs: function(){
        var trocMap = makeMap(fakeTrocs, 'id');
        var adMap = makeMap(fakeAds, 'id');
        var userMap = makeMap(fakeUsers, 'id');

        loadActionCreator.loadTrocs(trocMap);
        loadActionCreator.loadAds(adMap);
        loadActionCreator.loadUsers(userMap);
    }
};
