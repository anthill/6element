'use strict';

var categories = require('../../data/recycling_types.json');
var catMap = new Map();
var invCatMap = new Map();

// Build inverted categories Map
Object.keys(categories).forEach(function(category){
	categories[category].forEach(function(subCategory){
		invCatMap.set(subCategory, category);
	});
});

function categorizer(inputPoints){
	var unknown_tags = {};

	var newPoints = inputPoints.map(function(point){
		var lat = point.geometry.coordinates[1];
		var lon = point.geometry.coordinates[0];
		
		var tags = point.properties.tags;
		var basePoint = {
			osm_id: point.properties.id,
			name: point.properties.tags.name,
			operator: point.properties.tags.operator,
			source: point.properties.tags.source,
			recycling_type: point.properties.tags.recycling_type,
			opening_hours: point.properties.tags.opening_hours,
			lat: lat,
			lon: lon,
			geom: 'POINT(' + lon + ' ' + lat + ')',
			network: 5 // OSM, to be changed 
		};

		var output = [];

		var pointCategories = new Map();

		Object.keys(tags).forEach(function(tagKey){
			var match = tagKey.match(/^recycling:(.*)/); // check if the tag matches the RegExp 'recycling:*'

			if (match){ // if a match is found
				var subCat = match[1];

				if (invCatMap.get(subCat) === undefined) // if tag is unknown, count how many occurences
					unknown_tags[subCat] = unknown_tags[subCat] ? unknown_tags[subCat] + 1 : 1;

				if (tags[tagKey] === 'yes'){ // check if the tag is ON
					var mainCat = invCatMap.get(subCat);

					if (pointCategories.has(mainCat))
						pointCategories.get(mainCat).push(subCat);
					else
						pointCategories.set(mainCat, [subCat]);
				}
			}
		});

		var nb = pointCategories.size;

		var i = 0;

		pointCategories.forEach(function(category){
			var newPoint = Object.assign({}, basePoint); // creating a sibling point, which will differ only by category, subcategories, and coords

			newPoint.category = category;
			newPoint.subcategories = pointCategories.get(category); // in DB, field name is all lowercase

			// offsetting points by about 1 m
			var newLat = basePoint.lat + 0.00001 * Math.cos(2 * Math.PI * i / nb);
			var newLon = basePoint.lon + 0.00001 * Math.sin(2 * Math.PI * i / nb);

			newPoint.lat = newLat;
			newPoint.lon = newLon;

			output.push(newPoint);

			i++;
		});

		if (output.length === 0)
			return [basePoint];
		else
			return output;
	});

	if (Object.keys(unknown_tags).length > 0)
		console.log('Unknown tags', unknown_tags);

	return newPoints;
}

module.exports = categorizer;
