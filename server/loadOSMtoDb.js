'use strict';

var loader = require('./osm/osmLoader');
var OsmPlaces = require('./database/models/osmPlaces.js');

loader()
.then(function(osmData){
	console.log('Nb of points in OSM', osmData.length);
	
	var data = osmData.map(function(place){
		return {
			osm_id: place.properties.id,
			tags: place.properties.tags,
			lat: place.geometry.coordinates[1],
			lon: place.geometry.coordinates[0]
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