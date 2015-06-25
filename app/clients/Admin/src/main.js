'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/src/makeMap.js');

var fakeAnts = require('./fakeAnts.js');

// Initial rendering dsds
React.render(new Application({
	ants: fakeAnts
}), document.body);