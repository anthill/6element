'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));

// Initial rendering
React.render(new Application, document.body);