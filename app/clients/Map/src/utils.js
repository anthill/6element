module.exports = {

	makeMap: function(object, desiredKey){
		var myMap = new Map();

		object.keys().forEach(function(key){
			myMap.set(object[key][desiredKey], object[key]);
		});

		return myMap;
	}
};