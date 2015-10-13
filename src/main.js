'use strict';

// Matrial-UI needs Symbols (as Polyfill), not included in es6-shim
window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

var React = require('react');

var Layout =  require('./views/layout.jsx');

React.render( 
  React.createElement(Layout),
  document.body
);
