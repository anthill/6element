'use strict';

function initializeAllPanels(){
	var list = document.getElementsByClassName('map-url');
    for(var i = 0; i< list.length; ++i ){
    	var elt = list[i];
    	var id = elt['id'].replace('pos-','');
    	var coords = elt['href'].replace('http://maps.apple.com/?q=','').split(',');
    	var centroid = {lat:parseFloat(coords[0]),lon:parseFloat(coords[1])};
    	var map = createMap(centroid, document.getElementById('map-'+id),13);
    	var CentroidIcon = L.Icon.Default.extend({
            options: {
                iconUrl:     '/img/locate.svg',
                iconSize:     [18, 18],
                shadowSize:   [0, 0], // size of the shadow
                iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
                shadowAnchor: [10, 10], // the same for the shadow
                popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
            }
        });
        var centroid = new L.Marker(new L.LatLng(centroid.lat, centroid.lon), {icon: new CentroidIcon()});
        centroid.addTo(map); 
	}
}

initializeAllPanels();
