(function(global){
    'use strict';
    var BORDEAUX_COORDS = [44.84, -0.57]
            
    var map = L.map('map').setView(BORDEAUX_COORDS, 11);
            
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
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
    var predictionsP = d3csvP("data/predictions.csv");
    var coordsP = d3csvP("data/coords.csv");
    var historicalP = d3csvP("data/historical.csv");
    
    var coordsByNameP = coordsP.then(function(coords){
        return coords.reduce(function(acc, curr){
            acc[curr.decheterie] = curr;
            return acc;
        }, Object.create(null));
    });
    
    Promise.all([historicalP, predictionsP, coordsByNameP]).then(function(results){
        //var historical = results[0]; // unused for now
        var predictions = results[1];
        var coordsByName = results[2];
        
        populateMap(predictions, coordsByName, map);
    });
    
})(this);