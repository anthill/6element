'use strict';

require('es6-promise').polyfill();

var React = require('react');

var SearchView =  require('./views/searchView.jsx');

React.render( 
  React.createElement(SearchView),
  document.body
);
