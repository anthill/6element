'use strict';

function makeMap(object, key){
	var myMap = new Map();

	for (var field in object){

		console.log('key', object[field][key]);
		console.log('object', object[field]);
	    myMap.set(object[field][key], object[field]);
	}

	return myMap;
}

module.exports = makeMap;
