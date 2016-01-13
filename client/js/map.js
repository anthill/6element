'use strict';

var Tokens = {
    "mapbox_token": "pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ",
    "map_id": "anthill.9c97b4cf",
    "google_token": "AIzaSyCLuhubHWNbDgBhmj61OUo07L-zjHsVkKw"
}

// For a yet unknown reason, this line works while it shouldn't (L should be undefined)
function addIconPulse(L){
    
    L.Icon.Pulse = L.DivIcon.extend({

        options: {
            className: '',
            iconSize: [12,12],
            fillColor: 'red',
            pulseColor: 'green'
        },

        initialize: function (options) {
            L.setOptions(this,options);

            // creating unique class name
            var uniqueClassName = 'lpi-'+ new Date().getTime()+'-'+Math.round(Math.random()*100000);

            this.options.className = this.options.className+' leaflet-pulsing-icon '+uniqueClassName;

            // prepare styles
            var css = '.'+uniqueClassName+'{background-color:'+this.options.fillColor+';}';
            css += '.'+uniqueClassName+':after{box-shadow: 0 0 6px 2px '+this.options.pulseColor+';}';

            // CREATE STYLE ELEMENT
            var styleEl=document.createElement('style');
            if (styleEl.styleSheet)
                styleEl.styleSheet.cssText=css;
            else
                styleEl.appendChild(document.createTextNode(css));

            // appending style element to document
            document.getElementsByTagName('head')[0].appendChild(styleEl);

            // initialize icon
            L.DivIcon.prototype.initialize.call(this,options);
        }
    });

    L.icon.pulse = function (options) {
        return new L.Icon.Pulse(options);
    };


    L.Marker.Pulse = L.Marker.extend({
        initialize: function (latlng,options) {
            options.icon = L.icon.pulse(options);
            L.Marker.prototype.initialize.call(this, latlng, options);
        }
    });

    L.marker.pulse = function (latlng,options) {
        return new L.Marker.Pulse(latlng,options);
    };
};

var map = undefined; //Single instance

function displayMap(){

	var divMap = document.getElementById("map");
	var isDisplayed = divMap.class === "show-map";

	// Change label
	var button = document.getElementById("btn-map");
	button.innerHTML = isDisplayed ? "Afficher la carte" : "Masquer la carte";

	//
	divMap.class = isDisplayed ? "hide-map" : "show-map";
	divMap.style.height = isDisplayed ? "0px" : "400px";

	if(!isDisplayed && map === undefined){

		addIconPulse(L);
		map = L.map("map", {
	        minZoom: 12,
	        maxZoom: 18,
	        layers: [
	                L.tileLayer(
	                    'https://api.tiles.mapbox.com/v4/' +
	                    Tokens.map_id +
	                    '/{z}/{x}/{y}.png?access_token=' +
	                    Tokens.mapbox_token, 
	                    {
	                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	                    }
	                )
	            ],
	        attributionControl: false,
	        zoomControl: false
	    });

	    var list = document.getElementsByClassName("data");
		
		// Bouding box to compute 
		var box = { 'n': null, 's': null, 'e': null, 'o': null };
		for(var i= 0; i<list.length; ++i){

			var node = list[i];
			var data = JSON.parse(node.innerHTML);
			var id = node.id.replace('data-','');
			var pos = document.getElementById('pos-'+id).href.replace("geo:","").split(",");
			
			var lat = pos[0];
			var lon = pos[1];
			// Fit extrem points to the bounds
			if(box.n === null || box.n < lat) box.n = lat;
			if(box.s === null || box.s > lat) box.s = lat;
			if(box.e === null || box.e < lon) box.e = lon;
			if(box.o === null || box.o > lon) box.o = lon;

			var color = node.parentNode.parentNode.getElementsByClassName("place-avatar")[0].style.backgroundColor;
			
			if(color === 'grey'){
				// Closed => Not pulse
				var options = {
					color: 'black',
					fill: true,
					fillColor: color, 
					fillOpacity: 1,
					radius: 10,
					clickable: true,
					weight: 5
				};
				var marker = new L.CircleMarker(new L.LatLng(lat, lon),options);
				marker["placeId"] = id;
				marker.addTo(map);
				marker.on("click", function(e){
					window.location.hash = '#'+ e.target.placeId;
				});
			}
			else {
				var pulsingIcon = new L.Icon.Pulse({iconSize:[20,20],fillColor: options.color, pulseColor: options.color});
				var marker = L.marker(new L.LatLng(lat, lon), {icon: pulsingIcon});
				marker.addTo(map);
			}

		}

	    if(window.location.search.indexOf("?position=") !== -1){

	    	var coords = JSON.parse(window.location.search.replace("?position=", ""));
			map.setView(coords, 13);
	    }
	    else
	    {
			var southWest = L.latLng(box.s, box.o);
			var northEast = L.latLng(box.n, box.e);
			map.fitBounds(L.latLngBounds(southWest, northEast));
	    }
	}

}

function initializeMapButton(){

	var button = document.getElementById("btn-map");
	button.addEventListener("click", displayMap);
}