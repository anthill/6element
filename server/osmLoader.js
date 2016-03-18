'use strict';

var osm = require('query-overpass');

var queryDic = require('./query.json');
var converter = require('./wayToPointConverter.js');

module.exports = function(bbox){

	var bboxCoords = [bbox.south, bbox.west, bbox.north, bbox.east].join(',');
	var bboxString = 'bbox: ' + bboxCoords;

	var query = queryDic.viewport.replace(/bbox/, bboxString);

	var resultP = new Promise(function(resolve, reject){
		osm(query, function(error, data){
			if (error) reject(error);
			else resolve(data);
		});
	});


	return resultP.then(function(result){
		console.log('Nb of points', result.features.length);
		return converter(result.features);
	})
	.catch(function(error){
		console.log('Couldn\'t load OSM data', error);
	});
};

