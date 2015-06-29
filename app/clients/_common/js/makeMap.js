'use strict';

function makeMap(objects, expectedKey){
	var myMap = new Map();

	// objects.keys().forEach(function(key){
	// 	myMap.set(objects[key][expectedKey], objects[expectedKey]);
	// })

	for (var key in objects){
		myMap.set(objects[key][expectedKey], objects[key]);
	}

	return myMap;
}

module.exports = makeMap;
