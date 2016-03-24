'use strict';

var makeMap = require('../tools/makeMap');
var categoryMap = makeMap(require('../references/categories.json'), 'name');

module.exports = function(points){
	points.forEach(function(point){
	    
		if (point.bins){
			point.bins.forEach(function(bin){
				var type = categoryMap.get(bin.t);
				if (type)
		        	bin.color = type.color;
		        else bin.color = '000';
		    });
		}
	    
	});

	return points;
};
