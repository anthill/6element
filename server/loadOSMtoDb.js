'use strict';

var connectToDB = require('./database/management/connectToDB.js');
var dropOSMTable = require('./database/management/dropOSMTable.js');
var createTables = require('./database/management/createTables.js');
var generateDeclarations = require('../server/database/management/generateDecl.js');

var loadOSM = require('./osm/osmLoader');
var categorize = require('./osm/categorizer');
var saveBinStatus = require('./osm/saveBinStatus');
var loadBinStatus = require('./osm/loadBinStatus');

saveBinStatus()
.then(function(savedBins){
	return connectToDB()
	.then(function(db){
		return dropOSMTable(db)
		.then(function(){
			return createTables(db);
		});
	})
	.then(function(){
	    return generateDeclarations();
	})
	.then(function(){
		return loadOSM();
		// return require(__dirname + '/../data/osmDataConverted.json').features; // if you need to load manually a OSM file
	})
	.then(function(osmData){
		var OsmPlaces = require('./database/models/osmPlaces.js'); // needs to be loaded after declarations are generated

		var data = loadBinStatus(categorize(osmData), savedBins);

		console.log('Recycling points in OSM:', data.length);
		console.log('New points:', data.length - Object.keys(savedBins).length);
		console.log('Creating points in DB ...');

		return OsmPlaces.create(data);
	});
})
.then(function(){
	console.log('All OSM Places created');
	process.exit();
})
.catch(function(err){
	console.error('ERROR creating OSM Place', err.stack);
	process.exit();
});
