'use strict';

var fs = require('fs');

var dropTableScript = fs.readFileSync( require.resolve('./dropAllTables.sql') ).toString();

module.exports = function(db){
	console.warn('\n\t=====\n\nWARNING! Dropping all tables!\n\n\t=====\n');
	
	return new Promise(function(resolve, reject){
		db.query(dropTableScript, function(err, result) {
			if(err)
				reject('Coudn\'t drop the tables: ' + err); 
			else resolve(result);
		});
	});
};
