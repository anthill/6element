'use strict';

var connectToDB = require('./database/management/connectToDB.js');
var dropOSMTable = require('./database/management/dropOSMTable.js');
var createTables = require('./database/management/createTables.js');
var generateDeclarations = require('../server/database/management/generateDecl.js');

var loadOSM = require('./osm/osmLoader');
var categorize = require('./osm/categorizer');
var loadBinStatus = require('./osm/loadBinStatus');

connectToDB()
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
})
.then(function(osmData){
	console.log('Nb of points in OSM', osmData.length);

	var OsmPlaces = require('./database/models/osmPlaces.js'); // needs to be loaded after declarations are generated

	var data = loadBinStatus(categorize(osmData));

	console.log('osmData', osmData.length);
	console.log('data', data.length);

	return OsmPlaces.create(data);
})
.then(function(){
	console.log('All OSM Places created');
	process.exit();
})
.catch(function(err){
	console.error('ERROR creating OSM Place', err.stack);
	process.exit();
});
