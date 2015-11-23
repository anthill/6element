'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

require('es6-shim');
var React = require('react');
var requestNetworks = require('./js/requestNetworks.js');
var requestCategories = require('./js/requestCategories.js');// EN & FR versions

var Layout =  require('./views/layout.jsx');

var networksP = requestNetworks()
.catch(function(err){
	console.error('requestNetworks error', err);
});

var categoriesP = requestCategories()
.then(function(categories){
    var listFR = ['Tous'];
    var listEN = ['All'];

    Object.keys(categories).forEach(function(key){
        listEN.push(key);
        listFR.push(categories[key]);
    });

    return {
        categoriesEN: listEN, 
        categoriesFR: listFR
    };
})
.catch(function(err){
    console.error('requestCategories error', err);
});


Promise.all([ networksP, categoriesP ])
.then(function(result){
    var networks = result[0];
    var categories = result[1];
    
    var props = Object.assign({networks: networks}, categories); 
    React.render( 
        React.createElement(Layout, props),
        document.body
    );
    
})
