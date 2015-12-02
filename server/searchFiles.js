"use strict";

var request = require('request');
var hstore = require('pg-hstore')();
var Places = require('./database/models/places.js');
var dictionnary = require('../data/dictionary.json');

// Avalaible objects
var parseObjects = function(row){
    return new Promise(function(resolve){

        hstore.parse(row.objects, function(fromHstore) {

            var objects = {};
            Object.keys(fromHstore).forEach(function(key){
                var fr = dictionnary[key];
                objects[fr]= fromHstore[key];
            });
            resolve(objects);
        });
    });
}

// Bins status
var parseBins = function(row){
    return new Promise(function(resolve){

        if(row.bins == undefined) resolve (undefined);
        else {
            hstore.parse(row.bins, function(fromHstore) {
                resolve(fromHstore);
            });
        }
    });
}

var toGeoJson = function(results){

    return Promise.all(
        results.map(function(result){
            return new Promise(function(resolve){

                parseObjects(result)
                .then(function(objects){

                    parseBins(result)
                    .then(function(bins){

                        result["objects"] = objects;
                        result["bins"] = bins;
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
                    });
                });
            })
        })
    );     
}

var withPlacesMeasurements = function(list){

    
    return Promise.all(

        list.map(function(object){

            return new Promise(function(resolve, reject){
                
                request({
                    method: 'GET',
                    url:'https://pheromon.ants.builders/placeLatestMeasurement/'+object.pheromon_id+'/wifi', 
                    headers: {'Content-Type': 'application/json;charset=UTF-8'},
                }, function(error, response, body){
                    if (!error) {
                        if(response !== undefined &&
                            response.statusCode < 400){
                            resolve(JSON.parse(body));
                        } else {
                            reject(Object.assign(
                                new Error('HTTP error because of bad status code ' + body),
                                {
                                    HTTPstatus: typeof response === 'undefined'?'':response.statusCode,
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
                                    HTTPstatus: typeof response === 'undefined'?'':response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                    }
                });
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

        Places.getWithin(data.geoloc, data.boundingBox, data.categories, 2000)
        .then(function(results){
            toGeoJson(results)
            .then(function(geoJson){

                var list = geoJson.map(function(place, index){
                    return {'index': index, 'pheromon_id': place.properties.pheromon_id};
                })
                .filter(function(object){
                    return (object.pheromon_id !== null && 
                            object.pheromon_id !== undefined);
                });

                withPlacesMeasurements(list)
                .then(function(measures){

                    if(measures !== null){
                        measures.forEach(function(measure, index){
                            geoJson[list[index].index]["measurements"] = {latest: measure.latest, max: measure.max};
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
                
                var list = geoJson.map(function(place, index){
                    return {'index': index, 'pheromon_id': place.properties.pheromon_id};
                })
                .filter(function(object){
                    return (object.pheromon_id !== null && 
                            object.pheromon_id !== undefined);
                });

                withPlacesMeasurements(list)
                .then(function(measures){

                    if(measures !== null){
                        measures.forEach(function(measure, index){
                            geoJson[list[index].index]["measurements"] = {latest: measure.latest, max: measure.max};
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
    }
    else{
         console.log("-> request without centroid nor boundingBox");
        return;       
    }
}
