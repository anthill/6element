'use strict';

var connectToDB = require('./database/management/connectToDB.js');
var loadOSM = require('./osm/osmLoader');
var dropOSMTable = require('./database/management/dropOSMTable.js');
var createTables = require('./database/management/createTables.js');
var OsmPlaces = require('./database/models/osmPlaces.js');

connectToDB()
.then(function(db){
	return dropOSMTable(db)
	.then(function(){
		return createTables(db);
	});
})
.then(function(){
	return loadOSM();
})
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