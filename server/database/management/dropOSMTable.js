'use strict';

var fs = require('fs');

var dropOSMTableScript = fs.readFileSync( require.resolve('./dropOSMTable.sql') ).toString();

module.exports = function(db){
    console.warn('\n\t=====\n\nWARNING! Dropping OSM tables!\n\n\t=====\n');
    
    return new Promise(function(resolve, reject){
        db.query(dropOSMTableScript, function(err, result) {
            if(err)
            	reject('Coudn\'t drop OSM table: ' + err); 
            else resolve(result);
        });
    });
};
