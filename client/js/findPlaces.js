'use strict';

(function(global){

    global.findPlaces = function(centroid, bounds, certified){
        return fetch('/search', {
            method: 'POST',
            body: JSON.stringify({
                boundingBox : bounds,
                geoloc: centroid,
                certified: certified,
                categories: ["All"]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(result){ return result.json() })
    };
    
})(this);