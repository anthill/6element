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
        console.log('-> request without parameters');
        return;
    } 
    
    var result = {
        categories: data.categories,
        placeName: data.placeName,
        objects: []
    };

    if(data.boundingBox !== null &&
        data.geoloc !== null){

        var dbDataP = Places.getWithin(data.geoloc, data.boundingBox, data.categories, 2000)
        .then(toGeoJson);

        var osmDataP = OsmPlaces.getWithin(data.geoloc, data.boundingBox, data.categories, 2000)
        .then(toGeoJson);

        Promise.all([dbDataP, osmDataP])
        .then(function(results){
            var dbData = results[0];
            var osmData = results[1];

            console.log('Nb db', dbData.length);
            console.log('Nb osm', osmData.length);

            var completeData = dbData.concat(osmData);

            var list = completeData.map(function(place, index){
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
                            completeData[list[index].index]['measurements'] = {latest: measure.latest, max: measure.max};
                        else
                            completeData[list[index].index]['measurements'] = undefined;
                    });
                }
                result.objects = completeData;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            })
            .catch(function(err){
                console.error(err);
                result.objects = completeData;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            });
        })
        .catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });

    } else if(data.geoloc !== null){

        var dbDataP = Places.getKNearest({"lon": data.geoloc.lon, "lat": data.geoloc.lat}, data.nbPlaces, data.categories)
        .then(toGeoJson);

        var osmDataP = OsmPlaces.getKNearest({"lon": data.geoloc.lon, "lat": data.geoloc.lat}, data.nbPlaces, data.categories)
        .then(toGeoJson);

        Promise.all([dbDataP, osmDataP])
        .then(function(results){
            var dbData = results[0];
            var osmData = results[1];

            var completeData = dbData.concat(osmData);

            var list = completeData.map(function(place, index){
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
                            completeData[list[index].index]['measurements'] = {latest: measure.latest, max: measure.max};
                        else
                            completeData[list[index].index]['measurements'] = undefined;
                    });
                }
                result.objects = completeData;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            })
            .catch(function(err){
                console.error(err);
                result.objects = completeData;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            });
        })
        .catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    }
    else{
        console.log('-> request without centroid nor boundingBox');
        return;       
    }
};
