'use strict';

var fs = require('fs');

var connectToDB = require('./connectToDB.js');

var dropTableScript = fs.readFileSync( require.resolve('./dropAllTables.sql') ).toString();

module.exports = function(){
    console.warn('\n\t=====\n\nWARNING! Dropping all tables!\n\n\t=====\n');
    
    return new Promise(function(resolve, reject){
        connectToDB().then(function(db){
            db.query(dropTableScript, function(err, result) {
                if(err) reject(err); else resolve(result);
            });

        }).catch(reject);
    });
};
