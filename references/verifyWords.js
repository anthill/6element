'use strict';

var makeMap = require('../tools/makeMap');
var dic = makeMap(require('./dictionary.json'));

var allCat = require('./categories.json');

var allSub = [];

var missing = 0;

allCat.forEach(function(cat){
	cat.objects.forEach(function(object){
		var newWord = {};
		newWord[object] = dic.get(object);
		allSub.push(newWord);

		if (!dic.get(object)){
			missing ++;
			console.log('Missing translation', object);
		}
	});
});

console.log('Missing', missing, '/', allSub.length, 'Dic length', dic.size);
