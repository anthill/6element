'use strict';

var centroid = require('turf-centroid');

module.exports = function(entries){

	return entries.map(function(entry){
		entry.properties.file = 'Réseau Openstreetmap';
		entry.properties.color = 'rgb(45, 184, 222)';

		if (entry.properties.type === 'way'){
			var point = centroid(entry);
			point.properties = entry.properties;

			return point;
		}
		else
			return entry;
	});
};
