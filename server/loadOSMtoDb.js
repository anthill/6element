'use strict';

var loader = require('./osm/osmLoader');
var OsmPlaces = require('./database/models/osmPlaces.js');

loader()
.then(function(osmData){
	console.log('Nb of points in OSM', osmData.length);

	var data = osmData.map(function(place){
		var lat = place.geometry.coordinates[1];
		var lon = place.geometry.coordinates[0];

		return {
			osm_id: place.properties.id,
			tags: place.properties.tags,
			lat: lat,
			lon: lon,
			geom: 'POINT(' + lon + ' ' + lat + ')',
			network: 5 // Réseau Openstreetmap
		};
	});

	return OsmPlaces.create(data);
})
.then(function(){
	console.log('All OSM Places created');
	process.exit();
})
.catch(function(err){
	console.error('ERROR creating OSM Place', err);
	process.exit();
});