'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));

var localAPIUtils = require('./Utils/localAPIUtils.js');

localAPIUtils.loadDisplayState();

// Initial rendering
React.render(new Application({}), document.body);
