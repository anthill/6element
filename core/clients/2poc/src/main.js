'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));

var localStorageUtils = require('./Utils/localStorageUtils.js');
var serverAPIUtils = require('./Utils/serverAPIUtils.js');

// localStorage.clear();

localStorageUtils.loadDisplayState();
// localStorageUtils.loadAds();
serverAPIUtils.loadRCs();
// serverAPIUtils.loadTrocs();
localStorageUtils.loadTrocs();

// Initial rendering
React.render(new Application({}), document.body);
