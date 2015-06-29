'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/src/makeMap.js');
var serverAPI = require('../../_common/src/serverAPI.js');

var errlog = console.error.bind(console);

var fakeAnts = require('./fakeAnts.js');

var ants = serverAPI.getAllSensors()
    .then(function(sensors){
        console.log('sensors', sensors);
        // Initial rendering
		React.render(new Application({
			ants: sensors
		}), document.body);
    })
    .catch(errlog);

