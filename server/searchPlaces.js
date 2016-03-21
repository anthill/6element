'use strict';

// var osmLoader = require('./osmLoader.js');
var toGeoJson = require('./toGeoJson.js');
var Places = require('./database/models/places.js');
var OsmPlaces = require('./database/models/osmPlaces.js');
var withPlacesMeasurements = require('./withPlacesMeasurements.js');

/*
    Expects body to be {
        boundingBox : {
            minLon: number,
            maxLon: number,
            minLat: number,
            maxLat: number
        },
        geoloc: {
            lon: number,
            lat: number
        },
        certified: true,
        categories : String[]
    }

*/
module.exports = function(req, res){
    
    var data = req.body;
    if(data === null){
        console.log('-> request without parameters');
        return;
    } 
    
    var result = {
        categories: data.categories,
        placeName: data.placeName,
        objects: []
    };

    var todo = undefined; 

    if(data.boundingBox !== null && data.geoloc !== null){

        todo = data.certified ?
            OsmPlaces.getWithin(data.geoloc, data.boundingBox, data.categories, 2000).then(toGeoJson) :
            Places.getWithin(data.geoloc, data.boundingBox, data.categories, 2000).then(toGeoJson);

    } else if(data.geoloc !== null) {

        todo = data.certified ?
            OsmPlaces.getKNearest({"lon": data.geoloc.lon, "lat": data.geoloc.lat}, data.nbPlaces, data.categories) :
            Places.getKNearest({"lon": data.geoloc.lon, "lat": data.geoloc.lat}, data.nbPlaces, data.categories);
    
    } else {
        console.log('-> request without centroid nor boundingBox');
        return;       
    }

    todo.then(function(results){

        var list = results.map(function(place, index){
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
                    results[list[index].index]['measurements'] = (measure) ?
                        {latest: measure.latest, max: measure.max} : undefined;
                });
            }
            result.objects = results;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        })
        .catch(function(err){
            console.error(err);
            result.objects = results;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
    })
    .catch(function(err){
        console.error(err);
        res.status(500).send(err);
    });
};
