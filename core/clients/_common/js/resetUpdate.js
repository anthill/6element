'use strict';

module.exports = function (map){
	map.forEach(function(element){
		element.isUpdating = false;
	});
};
