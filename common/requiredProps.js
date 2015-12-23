"use strict";

var networks = require('../data/networks.json');

var dictionary = require('../data/dictionary.json');
var listFR = ['Tous'];
var listEN = ['All'];

Object.keys(dictionary).forEach(function(key){
    listEN.push(key);
    listFR.push(dictionary[key]);
});

var categories = {
    categoriesEN: listEN, 
    categoriesFR: listFR
};

module.exports = Object.assign({networks: networks}, categories);
