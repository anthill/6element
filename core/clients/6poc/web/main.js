'use strict';

var React = require('react');

var MainView =  React.createFactory(require('./views/mainView.jsx'));

React.render( 
  new MainView(),
  document.body
);
