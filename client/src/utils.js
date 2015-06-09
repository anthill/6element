module.exports = {

	makeMap: function(object){
		var myMap = new Map();

		for (var field in object){
		    myMap.set(object[field].id, object[field]);
		}

		return myMap;
	}
};