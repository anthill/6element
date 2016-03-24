'use strict';

function makeMap(objects, expectedKey){
    var myMap = new Map();

    Object.keys(objects).forEach(function(key){
    	if (expectedKey)
        	myMap.set(objects[key][expectedKey], objects[key]);
        else
        	myMap.set(key, objects[key]);
    });

    return myMap;
}

module.exports = makeMap;
