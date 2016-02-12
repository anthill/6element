"use strict";

var toGeoJson = require('./toGeoJson.js');
var Places = require('./database/models/places.js');
var withPlacesMeasurements = require('./withPlacesMeasurements.js');

/*
    Expects body to be {
        boundingBox : {
            minLon: number,
            maxLon: number,
            minLat: number,
            maxLat: number
        }
        geoloc: {
            lon: number,
            lat: number
        }
        categories : String[]
    }

*/
module.exports = function(req, res){
    
    var data = req.body;
    if(data === null){
        console.log("-> request without parameters");
        return;
    } 
    
    console.log('data', data)
    
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
                            if (measure)
                                geoJson[list[index].index]["measurements"] = {latest: measure.latest, max: measure.max};
                            else
                                geoJson[list[index].index]["measurements"] = undefined;
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
                            if (measure)
                                geoJson[list[index].index]["measurements"] = {latest: measure.latest, max: measure.max};
                            else
                                geoJson[list[index].index]["measurements"] = undefined;
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
