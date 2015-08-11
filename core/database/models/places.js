"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var places = require('../management/declarations.js').places;

module.exports = {
    create: function (data) {
        console.log("test4 + data", data);
        return databaseP.then(function (db) {
            
            var query = places
                .insert(data)
                .returning('id')
                .toQuery();

            //console.log('places create query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0].id);
                });
            });
        })
    },

    update: function(id, delta) {
        return databaseP.then(function (db) {
            
            var query = places
                .update(delta)
                .where(places.id.equals(id))
                .returning("*")
                .toQuery();

            //console.log('sensors findByPhoneNumber query', query);
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in update', err);
        });        
    }
};
