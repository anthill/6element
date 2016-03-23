'use strict';

function makeMap(objects, expectedKey){
    var myMap = new Map();

    Object.keys(objects).forEach(function(key){
        myMap.set(objects[key][expectedKey], objects[key]);
    });

    return myMap;
}

module.exports = makeMap;