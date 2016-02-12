'use strict';

(function(global){

    global.findPlaces = function(bounds){
        return fetch('/search', {
            method: 'POST',
            body: JSON.stringify({
                boundingBox : bounds,
                geoloc: {
                    lon: -0.5805,
                    lat: 44.8404
                },
                categories: ["All"]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(result){ return result.json() })
    };
    
})(this);