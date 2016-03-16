'use strict';

var fs = require('fs');
var osm = require('query-overpass');

var queryDic = require('./query.json');
var converter = require('./wayToPointConverter.js');

var lon = -0.570778;
var lat = 44.8472;

// var bbox = {maxLat: 44.853009071034684, minLat: 44.82963909690866, maxLon: -0.517730712890625, minLon: -0.627593994140625};
// var bbox = {maxLat: lat + 0.5, minLat: lat - 0.5, maxLon: lon + 0.5, minLon: lon - 0.5};

// console.log('bbox', bbox);



module.exports = function(bbox){

	var bboxCoords = [bbox.south, bbox.west, bbox.north, bbox.east].join(',');
	var bboxString = 'bbox: ' + bboxCoords;

	var query = queryDic.viewport.replace(/bbox/, bboxString);

	var resultP = new Promise(function(resolve, reject){
		osm(query, function(error, data){
			if (error)
			    reject(error);
			else
				resolve(data);
		});
	});


	return resultP.then(function(result){
		console.log('Nb of points', result.features.length);
		result.features = converter(result.features);

		return result;
	})
	.catch(function(error){
		console.log('Couldn\'t load OSM data', error);
	});
};


