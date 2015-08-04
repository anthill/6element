'use strict';

// var fs = require('fs');

// ACTIONS
var loadActionCreator = require('../Actions/loadActionCreator.js');
var makeMap = require('./utils.js').makeMap;

// i couldn't use RC_FILE as the require parameter :/
// var RC_FILE = '../../data/rcs.json';
var recyclingCenters = require('../../data/rcs.json');

module.exports = {

    loadRCs: function(){
        var recyclingCenterMap = makeMap(recyclingCenters, 'id');
        loadActionCreator.loadRecyclingCenters(recyclingCenterMap);
    }
};
