'use strict';

require('es6-shim');

var React = require('react');

var Layout =  require('./views/layout.jsx');

React.render( 
  React.createElement(Layout),
  document.body
);
