'use strict';

function makeMap(objects, expectedKey){
	var myMap = new Map();

	objects.keys().forEach(function(key){
		myMap.set(objects[key][expectedKey], objects[expectedKey]);
	})

	return myMap;
}

module.exports = makeMap;
