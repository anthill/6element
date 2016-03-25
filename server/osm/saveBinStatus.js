'use strict';

var fs = require('fs');
var path = require('path');

var OsmPlaces = require('../database/models/osmPlaces.js');

var fileName = path.join(__dirname, 'osmBinStatusDump.json');

OsmPlaces.getAllBins()
.then(function(data){
	fs.writeFileSync(fileName, JSON.stringify(data));
	console.log('OSM bins availability saved', data.length);
	process.exit();
})
.catch(function(err){
	console.log('ERR', err);
	process.exit();
});
