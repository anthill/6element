'use strict';

var constants = require('./constants.js');

var myMap = new Map();

Object.keys(constants.senseStatus).forEach(function(key){
	myMap.set(key.toLowerCase(), key)
});

Object.keys(constants.quipuStatus).forEach(function(key){
	if (key === 'CONNECTED3G')
		myMap.set('3G_connected', key);
	else
		myMap.set(key.toLowerCase(), key)
});

module.exports = myMap;
