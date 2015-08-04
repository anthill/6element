'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));

var localAPIUtils = require('./Utils/localAPIUtils.js');
var serverAPIUtils = require('./Utils/serverAPIUtils.js');

localAPIUtils.loadDisplayState();
serverAPIUtils.loadRCs();
serverAPIUtils.loadTrocs();

// Initial rendering
React.render(new Application({}), document.body);
