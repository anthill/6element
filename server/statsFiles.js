"use strict";

var hstore = require('pg-hstore')();
var Places = require('./database/models/places.js');
var dictionnary = require('../data/dictionnary.json');

var toGeoJson = function(results){

    return Promise.all(
        results.map(function(result){
            return new Promise(function(resolve){

                hstore.parse(result["objects"], function(fromHstore) {

                    result["objects"] = {}
                    Object.keys(fromHstore).forEach(function(key){
                        var fr = dictionnary[key];
                        result.objects[fr]= fromHstore[key];
                    });

                    var geoJson = { 
                        type: 'Feature',
                        properties: result,
                        geometry: { "type": "Point", "coordinates": {"lat":result["lat"], "lon": result["lon"]} },
                        distance: result.distance,
                        color: result.color,
                        file: result.file,
                        rate: 3 
                    }
                    resolve(geoJson);
                })
            })
        })
    );     
}

module.exports = function(req, res){

    var data = req.body;
    if(data === null){
        console.log("-> request without parameters");
        return;
    } 

    var stats = {};
    Object.keys(dictionnary).forEach(function(key){
        var fr = dictionnary[key];
        stats[fr]= 0;
    });


    if(data.boundingBox !== null &&
        data.geoloc !== null){

        Places.getWithin(data.geoloc, data.boundingBox, data.categories, 100000)
        .then(function(results){
            toGeoJson(results)
            .then(function(geoJson){
                
                geoJson.forEach(function(place){
                    Object.keys(place.properties.objects).forEach(function(fr){
                        stats[fr]++;
                    });
                });

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(stats));
            
            })
            .catch(function(err){
                console.error(err);
                res.status(500).send(err);
            });
        })
        .catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });

    }  else{
         console.log("-> request without centroid nor boundingBox");
        return;       
    }
}
