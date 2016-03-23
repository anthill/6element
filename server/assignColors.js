'use strict';

var makeMap = require('../tools/makeMap');
var categoryMap = makeMap(require('../data/categories.json'), 'name');

module.exports = function(points){
	points.forEach(function(point){
	    
		if (point.bins){
			point.bins.forEach(function(bin){
		        bin.color = categoryMap.get(bin.t).color;
		    });
		}
	    
	});

	return points;
};
