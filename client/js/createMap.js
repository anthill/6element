'use strict';

function createMap(centroid, container, zoom){
        
    var mapboxTokens = {
        'mapbox_token': 'pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ',
        'map_id': 'anthill.9c97b4cf'
    }

    var position =[centroid.lat, centroid.lon];

    var map = L.map(container, {zoomControl:false, attributionControl: false}).setView(position, zoom);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        id: mapboxTokens.map_id,
        accessToken: mapboxTokens.mapbox_token
    }).addTo(map);
   
   return map;
}

