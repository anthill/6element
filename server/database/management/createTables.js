'use strict';

var fs = require('fs');

var createTableScript = fs.readFileSync( require.resolve('./createTables.sql') ).toString();

module.exports = function(db){
    console.log('== Creating the database tables ==');

    return new Promise(function(resolve, reject){
        db.query(createTableScript, function(err, result) {
            if(err)
                reject('Coudn\'t create the tables: ' + err); 
            else resolve(result);
        });
    };
};
