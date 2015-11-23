'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

require('es6-shim');
var React = require('react');

var Layout =  require('./views/layout.jsx');

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

var props = Object.assign({networks: networks}, categories);

document.addEventListener('DOMContentLoaded', function(){
    React.render( 
        React.createElement(Layout, props),
        document.body
    );
})

