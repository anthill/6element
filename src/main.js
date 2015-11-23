'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

require('es6-shim');
var React = require('react');

var Layout =  require('./views/layout.jsx');

var props = require('../common/layoutData');

document.addEventListener('DOMContentLoaded', function(){
    React.render( 
        React.createElement(Layout, props),
        document.body
    );
})

