(function(global){
    'use strict';
    var BORDEAUX_COORDS = [44.84, -0.57]
            
    var map = L.map('map').setView(BORDEAUX_COORDS, 11);
            
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    
    // unfortunate this is defer-loaded. xhr can happen in parallel of document loading
    // TODO make promises for all of this
    d3.csv("data/predictions.csv", function(error, predictions) {
        if(error)
            throw error;
        console.log('predictions', predictions);
        
        d3.csv("data/coords.csv", function(error, coords) {
            if(error)
                throw error;
            console.log('coords', coords);
        
            var coordsByName = coords.reduce(function(acc, curr){
                acc[curr.decheterie] = curr;
                return acc;
            }, Object.create(null));
            
            populateMap(predictions, coordsByName, map);
        
        });
            
        
    });

})(this);