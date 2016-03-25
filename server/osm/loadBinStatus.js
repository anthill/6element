'use strict';

var fs = require('fs');
var path = require('path');

var makeMap = require('../../tools/makeMap');

var saved = makeMap(require('./osmBinStatusDump.json'), 'osm_id');

function load(newOsmPoints){
	console.log('Loading bin status');
	return newOsmPoints.map(function(point){

		var savedPoint = saved.get(point.osm_id);

		if (point.type !== 'centre' && savedPoint){ // if the new osm point is not a center and has a reference in the db dump
			
			var savedBins = makeMap(savedPoint.bins, 't');

			point.bins.forEach(function(bin){
				if (savedBins.has(bin.t)){ // if the new osm point bin type is known in the dump 

					if (bin.a !== savedBins.get(bin.t).a){ // if bin status has changed in the dump
						bin.a = savedBins.get(bin.t).a;
						console.log('Bin', point.osm_id, bin.t, 'updated to', bin.a);
					}
				}
			});
		}

		return point;
	});
};

module.exports = load;
