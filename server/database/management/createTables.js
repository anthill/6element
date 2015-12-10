'use strict';

var fs = require('fs');

var connectToDB = require('./connectToDB.js');

var createTableScript = fs.readFileSync( require.resolve('./createTables.sql') ).toString();


module.exports = function(){
    return new Promise(function(resolve, reject){
        connectToDB()
        .then(function(db){
            console.log('== Creating the database tables ==');
            db.query(createTableScript, function(err, result) {
                if(err) reject(err); else resolve(result);
            });
  
        })
        .catch(function(err){
            console.error('Could not connect', err);
        });
    });
};
