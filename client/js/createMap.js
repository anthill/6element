'use strict';

function createMap(centroid, container){
        
    var mapboxTokens = {
        'mapbox_token': 'pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ',
        'map_id': 'anthill.9c97b4cf'
    }

    var position =[centroid.lat, centroid.lon];

    var map = L.map(container).setView(position, 16);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: mapboxTokens.map_id,
        accessToken: mapboxTokens.mapbox_token,
        attributionControl: false
    }).addTo(map);
    map.attributionControl.setPrefix('');
    
    return map;
}

