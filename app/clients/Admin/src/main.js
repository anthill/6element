'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/src/makeMap.js');

var fakeAnts = require('./fakeAnts.js');

console.log('fakeAnts', fakeAnts);

// Initial rendering
React.render(new Application, document.body);