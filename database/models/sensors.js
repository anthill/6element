"use strict";

var sql = require('sql');
var databaseP = require('../management/databaseClientP');


module.exports = {
    create: function(data){
        return databaseP.then(function(db){
            
            var query = [
                "INSERT INTO",
                "sensors",
                "("+"name"+")",
                "VALUES",
                "('"+data.name+"')",
                "RETURNING id"
            ].join(' ') + ';';

            console.log('sensors create query', query);
            
            return new Promise(function(resolve, reject){
                db.query(query, function(err, result){
                    if(err) reject(err); else resolve(result.rows[0].id);
                });
            });
        })
    }
};
