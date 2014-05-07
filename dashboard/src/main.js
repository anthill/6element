(function(global){
    'use strict';
    var BORDEAUX_COORDS = [44.84, -0.57];

    var map = L.map('map').setView(BORDEAUX_COORDS, 12);

    L.tileLayer('http://api.tiles.mapbox.com/v3/vallettea.hkjjf19g/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // promisi-fying d3.csv
    function d3csvP(url){
        return new Promise(function(resolve, reject){
            d3.csv(url, function(error, value) {
                if(error)
                    reject(error);
                else
                    resolve(value);
            });
        })
    }

    // unfortunate this is defer-loaded. xhr can happen in parallel of document loading
    // but leaflet probably needs the document to be ready

    // array of objects: name -> amount (string) + "Date" -> 'YYYY-MM-DD'
    var historicalP = d3csvP("data/historical.csv");

    // change to an object key'd on decheterie names which value will be a 'YYYY-MM-DD' -> amount (number) object
    // canonicalize recycling center names too
    historicalP = historicalP.then(function uniformizeHistoricalData(historical){
        //console.log('historical', historical);
        return historical.reduce(function(acc, dayData){

            var date = dayData['Date'];
            if( (new Date(date)).getFullYear() >= 2012 ){ // ignore data before 2012 since we won't plot it
                delete dayData['Date'];

                Object.keys(dayData).forEach(function(dechName){
                    var canonicalDechName = canonicalRecycleCenterName(dechName);

                    if( !(canonicalDechName in acc) ) // This can be avoided by getting the first line and prepopulation the acc
                        acc[canonicalDechName] = Object.create(null);

                    acc[canonicalDechName][date] = Number(dayData[dechName]);
                });
            }

            return acc;

        }, Object.create(null));
    });

    // array of objects: 'YYYY-MM-DD' -> amount (string) + "decheterie" -> name
    var predictionsP = d3csvP("data/predictions.csv");

    // change to an object key'd on decheterie names which value will be a 'YYYY-MM-DD' -> amount (number) object
    predictionsP = predictionsP.then(function uniformizePredictionData(predictions){
        return predictions.reduce(function(acc, curr){
            acc[ canonicalRecycleCenterName(curr.decheterie) ] = curr;
            delete curr.decheterie;

            Object.keys(curr).forEach(function(date){
                curr[date] = Number(curr[date]);
            });

            return acc;
        }, Object.create(null));
    })

    var coordsP = d3csvP("data/coords.csv");
    // key by name and canonicalize the name
    var coordsP = coordsP.then(function(coords){
        return coords.reduce(function(acc, curr){
            acc[ canonicalRecycleCenterName(curr.decheterie) ] = curr;
            return acc;
        }, Object.create(null));
    });

    historicalP.catch(function(err){
        console.error("Couldn't load", "data/historical.csv", err, 'Is it open data yet?')
    });

    // merge historical and prediction data
    var dataP = Promise.all([historicalP, predictionsP]).then(function(results){
        var historical = results[0];
        var predictions = results[1];

        //console.log("historical, predictions", historical, predictions);

        var data = Object.create(null);

        Object.keys(historical).forEach(function(dechName){
            var histData = historical[dechName];

            data[dechName] = Object.create(null);

            Object.keys(histData).forEach(function(date){
                data[dechName][date] = histData[date];
            });
        });

        Object.keys(predictions).forEach(function(dechName){
            if(!(dechName in data)){
                console.warn("There are predictions for", dechName, "which name doesn't have corresponding historical data");
                data[dechName] = Object.create(null); // so the script doesn't crash stupidly
            }

            var predData = predictions[dechName];

            Object.keys(predData).forEach(function(date){
                data[dechName][date] = predData[date];
            });
        });

        console.log('data', data);

        return data;
    })

    Promise.all([dataP, coordsP]).then(function(results){
        var data = results[0];

        var coordsByName = results[1];

        populateMap(data, coordsByName, map);
    });
    
    global.dataP = dataP;
    
})(this);
