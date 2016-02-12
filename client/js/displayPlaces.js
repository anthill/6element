'use strict';

(function(global){
    var markersLayer;

    global.displayPlaces = function(map, places, filterValues){

        if(markersLayer){
            map.removeLayer(markersLayer)
            markersLayer = undefined;
        }

        var markers = places
        .filter(function(place){
            var relevantFilter = filterValues.find(function(fv){
                return fv.name === place.file;
            })
            
            if(!relevantFilter)
                console.warn('No filter for place', place);
            
            return relevantFilter.checked;
        })
        .map(function(place){
            var isCenter = (place.properties.type === 'centre');
            var options = {
                color: 'black',
                fill: true,
                fillColor: place.color, 
                fillOpacity: 1,
                radius: isCenter ? 10 : 7,
                clickable: true,
                weight: isCenter ? 5 : 3 
            };

            var lat = place.geometry.coordinates.lat;
            var lon = place.geometry.coordinates.lon;

            var marker = new L.CircleMarker(new L.LatLng(lat, lon), options);

            return marker;
        });

        markersLayer = L.layerGroup(markers);
        map.addLayer(markersLayer);
    }
})(this);
