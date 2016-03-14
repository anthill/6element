'use strict';


function createMap(container){
    

   
    var search = location.search.substring(1);
    search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    if(search.position === undefined) return;
        
    var position = JSON.parse(search.position);
    
    var mapboxTokens = {
        "mapbox_token": "pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ",
        "map_id": "anthill.9c97b4cf"
    }

    var map = L.map(container).setView(position, 14);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: mapboxTokens.map_id,
        accessToken: mapboxTokens.mapbox_token
    }).addTo(map);
    
    return map;
}

