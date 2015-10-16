'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

var React = require('react');
var requestNetworks = require('./js/requestNetworks.js');

var Layout =  require('./views/layout.jsx');

requestNetworks()
.then(function(networks){
	var props = {networks: networks}; 
	React.render( 
	  React.createElement(Layout, props),
	  document.body
	);
});
/*.catch(function(err){
	console.log('/networks front error', err);
	// TODO 404 HERE ?
});*/
