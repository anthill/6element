"use strict";

var request = require('request');
var path = require('path');
var fs   = require('fs');
var hstore = require('pg-hstore')();
var Places = require('./database/models/places.js');
var dictionnary = require('../data/dictionnary.json');

var toGeoJson = function(results){

    return Promise.all(
        results.map(function(result){
            return new Promise(function(resolve, reject){

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

var withSensorMeasurements = function(list){

    return new Promise(function(resolve, reject){
        
        var sims = list.map(function(object){
            return object.sensor_id;
        });
       
        var data = { type: 'wifi', sims: sims };
        
        request({
            method: 'POST',
            url:'https://pheromon.ants.builders/sensorsLatestMeasurement', 
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
            body: JSON.stringify(data)
        }, function(error, response, body){
            if (!error) {
                if(response.statusCode < 400)
                    resolve(JSON.parse(body));
                else {
                    reject(Object.assign(
                        new Error('HTTP error because of bad status code ' + body),
                        {
                            HTTPstatus: response.statusCode,
                            text: body,
                            error: error
                        }
                    ));
                }
            }
            else {
                reject(Object.assign(
                        new Error('HTTP error'),
                        {
                            HTTPstatus: response.statusCode,
                            text: body,
                            error: error
                        }
                    ));
            }
        });
    });     
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

                var list = geoJson.map(function(place, index){
                    return {'index': index, 'sensor_id': place.properties.sensor_id};
                })
                .filter(function(object){
                    return (object.sensor_id !== null && 
                            typeof object.sensor_id !== 'undefined');
                });
                withSensorMeasurements(list)
                .then(function(measures){

                    if(measures !== null){
                        measures.forEach(function(measure, index){
                            geoJson[list[index].index]["measurements"] = (measure.latest/measure.max);
                        });
                    }
                    result.objects = geoJson;
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                })
                .catch(function(err){
                    console.error(err);
                    result.objects = geoJson;
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                });
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

        Places.getKNearest({"lon": data.geoloc.lon, "lat": data.geoloc.lat}, data.nbPlaces, data.categories)
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