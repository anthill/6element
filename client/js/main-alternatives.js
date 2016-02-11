"use strict";

fetch('/search', {
    method: 'POST',
    body: JSON.stringify({
        boundingBox : {
            minLon: -0.6,
            maxLon: -0.5,
            minLat: 44.8,
            maxLat: 44.9
        },
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
.then(function(result){ console.log('search results', result) })
.catch(function(err){ console.error('search error', err) })