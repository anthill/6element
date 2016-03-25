'use strict';

var makeMap = require('../../tools/makeMap');

module.exports = function(newOsmPoints, savedPoints){
	console.log('Loading bin status ...');

	var savedPointMap = makeMap(savedPoints, 'osm_id'); // savedBins is the data in osmBinStatusDump.json

	return newOsmPoints.map(function(point){

		var savedPoint = savedPointMap.get(point.osm_id);

		if (point.type !== 'centre' && savedPoint){ // if the new osm point is not a center and has a reference in the db dump
			
			var savedBinMap = makeMap(savedPoint.bins, 't');

			point.bins.forEach(function(bin){
				if (savedBinMap.has(bin.t)){ // if the new osm point bin type is known in the dump 

					if (bin.a !== savedBinMap.get(bin.t).a){ // if bin status has changed in the dump
						bin.a = savedBinMap.get(bin.t).a;
						console.log('Bin', point.osm_id, bin.t, 'updated to', bin.a);
					}
				}
			});
		}

		return point;
	});
};
