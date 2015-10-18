"use strict";

var path = require('path');
var fs   = require('fs');
var hstore = require('pg-hstore')();
var Places = require('./database/models/places.js');


var toGeoJson = function(results){

    return Promise.all(
        results.map(function(result){
            return new Promise(function(resolve, reject){

                hstore.parse(result["objects"], function(fromHstore) {

                    result["objects"] = fromHstore;

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
    
    var result = {
        categories: data.categories,
        placeName: data.placeName,
        objects: []
    }

    if(data.boundingBox !== null &&
        data.geoloc !== null){

        Places.getWithin(data.geoloc, data.boundingBox, data.categories)
        .then(function(results){
            toGeoJson(results)
            .then(function(geoJson){
                result.objects = geoJson;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
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

    } else if(data.geoloc !== null){

        Places.getKNearest({"lon": data.geoloc.lon, "lat": data.geoloc.lat}, 10, data.categories)
        .then(function(results){
            toGeoJson(results)
            .then(function(geoJson){
                result.objects = geoJson;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
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
    }
    else{
         console.log("-> request without centroid nor boundingBox");
        return;       
    }
}