'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');
var networks = require('../management/declarations.js').networks;

module.exports = {
    createByChunk: function (datas) {
        return databaseP.then(function (db) {

            return Promise.all(datas.map(function(data){

                var query = networks
                    .insert(data)
                    .returning('*')
                    .toQuery();
                return new Promise(function (resolve, reject) {
                    db.query(query, function (err, result) {
                        if (err) {
                            console.log("ERROR in saving entry", query);
                        }
                        else resolve(result.rows);
                    });
                });
            }))
        })
        .catch(function(err){
            console.log('ERROR in create bulk', err);
        });
    },

    getAll: function(){
        return databaseP.then(function (db) {
            
            var query = networks
                .select('*')
                .order(networks.name)
                .toQuery();
   
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getWithin', err);
        }); 
    },
};
