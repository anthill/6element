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
                iconSize:     [30, 30],
                shadowSize:   [5, 5] // size of the shadow
            }
        });
        var centroid = new L.Marker(new L.LatLng(centroid.lat, centroid.lon), {icon: new CentroidIcon()});
        centroid.addTo(map); 
	}
}

initializeAllPanels();
