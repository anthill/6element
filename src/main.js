'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

require('es6-shim');
var React = require('react');
var requestNetworks = require('./js/requestNetworks.js');
var requestCategories = require('./js/requestCategories.js');// EN & FR versions

var Layout =  require('./views/layout.jsx');

requestNetworks()
.then(function(networks){
	return requestCategories()
	.then(function(categories){
        var listFR = ['Tous'];
        var listEN = ['All'];

        Object.keys(categories).forEach(function(key){
            listEN.push(key);
            listFR.push(categories[key]);
        });

		var props = {networks: networks, categoriesEN: listEN, categoriesFR: listFR}; 
		React.render( 
            React.createElement(Layout, props),
            document.body
		);
	})
    .catch(function(err){
        console.log('requestCategories error', err);
    });

})
.catch(function(err){
	console.log('requestNetworks error', err);
});
