"use strict";

var mapboxTokens = {
    "mapbox_token": "pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ",
    "map_id": "anthill.9c97b4cf"
}

var map = L.map('map').setView([44.8404, -0.5805], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: mapboxTokens.map_id,
    accessToken: mapboxTokens.mapbox_token
}).addTo(map);


function displayPlaces(map, places){
    
    var markers = places.map(function(place){
        var isCenter = (place.properties.type === 'centre');
        var options = {
            color: 'black',
            fill: true,
            fillColor: place.color, 
            fillOpacity: isCenter ? 1 : 0.7,
            radius: isCenter ? 10 : 7,
            clickable: true,
            weight: isCenter ? 5 : 3 
        };
        
        var lat = place.geometry.coordinates.lat;
        var lon = place.geometry.coordinates.lon;
        
        var marker =  new L.CircleMarker(new L.LatLng(lat, lon), options);
        
        marker["idPoint"] = place.properties.id;
        return marker;
    });

    var markersLayer = L.layerGroup(markers);
    map.addLayer(markersLayer);
    
}







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
.catch(function(err){ console.error('search error', err) })
.then(function(result){
    console.log('search results', result)
    return displayPlaces(map, result.objects)
})
.catch(function(err){ console.error('display error', err) })



/*
function makeBounds(){
    var bounds = this.state.map.getBounds(); 
    var box = {
        'maxLat': bounds.getNorth(),
        'minLat': bounds.getSouth(),
        'maxLon': bounds.getEast(),
        'minLon': bounds.getWest()
    }
    this.props.onSearch(this.props.parameters, box, 3, 0);
}



function loadSelection(map, status, points, filters, center, selected, fitBounds ){
    var self = this;
    // STATUS Definition
    // -1- Empty map, Zoom 13, no BoundingBox, geoloc centered
    // -2- Filled map, no Zoom, BoudingBox, no centered
    // -3- Filled map, no Zoom, no BoundingBox, no centered
    // Cleaning map
    var markersLayer = this.state.markersLayer;
    // markers.forEach(function(marker){
    //   map.removeLayer(marker);
    // });
    if(this.state.markersLayer)
        map.removeLayer(this.state.markersLayer);

    var markers = [];
    var selected = null;
    // -> STATUS 1
    if(status === 1){
        if(center !== undefined){
            map.setView([center.lat, center.lon], Math.min(13, map.getZoom()));
        }
        this.setState({map: map, markersLayer: null, selected: selected});
        return;
    }

    // Bouding box to compute (only for STATUS 2)
    var box = { 'n': null, 's': null, 'e': null, 'o': null };
    var markerSelected = null;
    var list = filters
    .filter(function(filter){
            return filter.checked;
    })
    .map(function(filter){
        return filter.name;
    });
    points.filter(function(point){
        return (list.indexOf(point.file) !== -1);
    })
    .forEach(function(point){
        // Confirm that the selected point is still on the map
        if(self.state.selected !== null &&
            self.state.selected === point.properties.id){
            selected = self.state.selected;
        }
        var lat = point.geometry.coordinates.lat;
        var lon = point.geometry.coordinates.lon;
        // Fit extrem points to the bounds
        if(status === 2){
            if(box.n === null || box.n < lat) box.n = lat;
            if(box.s === null || box.s > lat) box.s = lat;
            if(box.e === null || box.e < lon) box.e = lon;
            if(box.o === null || box.o > lon) box.o = lon;
        }
        var isCenter = (point.properties.type === 'centre');
        var hasSensor = (point.properties.pheromon_id !== null);
        var options = {
            color: 'black',
            fill: true,
            fillColor: point.color, 
            fillOpacity: isCenter?1:0.7,
            radius: isCenter?10:7,
            clickable: true,
            weight: isCenter?5:3
        };

        // Regular point or Sensor kitted point
        var marker = null;
        if(hasSensor && point.measurements !== undefined){
            var color = getColor(point.measurements.latest, 0, point.measurements.max);

            var pulsingIcon = new L.Icon.Pulse({iconSize:[20,20],fillColor: point.color,pulseColor: color});
            marker = L.marker(new L.LatLng(lat, lon),{icon: pulsingIcon});
        }
        else
        {
            marker =  new L.CircleMarker(new L.LatLng(lat, lon), options);
        } 

        marker["idPoint"] = point.properties.id;
        marker.on("click", self.onClickMarker);
        markers.push(marker);
    });

    if(fitBounds){

            var southWest = L.latLng(box.s, box.o);
            var northEast = L.latLng(box.n, box.e);
            map.off('dragend', this.onMoveMap);
            map.off('zoomend', this.onMoveMap);
            //console.log('-> map.fitBounds', status);
            map.fitBounds(L.latLngBounds(southWest, northEast));
            map.on('dragend', this.onMoveMap);
            map.on('zoomend', this.onMoveMap);
    }

    if(center !== undefined){
        var CentroidIcon = L.Icon.Default.extend({
            options: {
                iconUrl:     '/img/centroid.png',
                iconSize:     [25, 25],
                shadowSize:   [0, 0], // size of the shadow
                iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
                shadowAnchor: [10, 10], // the same for the shadow
                popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
            }
        });
    }
    var centroid = new L.Marker(new L.LatLng(center.lat, center.lon), {icon: new CentroidIcon()});
    markers.push(centroid);
    centroid.addTo(map);


    map.on('click',   this.onClickMap); 

    var markersLayer = L.layerGroup(markers);
    map.addLayer(markersLayer);
    this.setState({map: map, markersLayer: markersLayer, selected: selected});
}

*/