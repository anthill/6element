'use strict';

var hstore = require('pg-hstore')();
var dictionnary = require('../references/dictionary.json');

// Avalaible objects
function parseObjects(row){
    return new Promise(function(resolve){

        if (row.objects){
            hstore.parse(row.objects, function(fromHstore) {

                var objects = {};
                Object.keys(fromHstore).forEach(function(key){
                    var fr = dictionnary[key];
                    objects[fr]= fromHstore[key];
                });
                resolve(objects);
            });
        }
        else resolve([]);
    });
}

module.exports = function(results){

    return Promise.all(
        results.map(function(result){
            return new Promise(function(resolve){

                parseObjects(result)
                .then(function(objects){

                    result['objects'] = objects;
                    var geoJson = { 
                        type: 'Feature',
                        properties: result,
                        geometry: { 'type': 'Point', 'coordinates': {'lat':result['lat'], 'lon': result['lon']} }
                    };
                    resolve(geoJson);
                })
                .catch(function(err){
                    console.log('ERROR in toGeoJson', err);
                });
            });
        })
    );     
};
