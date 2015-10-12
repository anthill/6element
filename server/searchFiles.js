"use strict";

var turf = require('turf');
var path = require('path');
var fs   = require('fs');
var hstore = require('pg-hstore')();
var Utils = require("./utils.js");
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
                        geometry: { "type": "Point", "coordinates": [result["lat"], result["lon"]] },
                        distance: 0.08488681638164158,
                        color: '#41B93D',
                        file: 'screlec.json',
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
        radius: data.radius,
        categories: data.categories,
        placeName: data.placeName,
        geoloc: [data.geoloc.lat, data.geoloc.lon],
        square: {}, 
        objects: []
    }
    var point = {
      "type": "Feature",
      "properties": {
        "marker-color": "#0f0"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [data.geoloc.lat, data.geoloc.lon]
      }
    };

    
    
    var distance = data.radius * Math.SQRT2;
    var units = 'kilometers';
    var leftDown = turf.destination(point, distance, 225, units).geometry.coordinates;
    var rightUp = turf.destination(point, distance, 45, units).geometry.coordinates;
    result.square = {
        minLat: leftDown[0],
        maxLat: rightUp[0],
        minLon: leftDown[1],
        maxLon: rightUp[1]
    };
    


    Places.getWithin(result.square)
    .then(function(results){
        toGeoJson(results)
        .then(function(geoJson){
            result.objects = geoJson;
            console.log(result)
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