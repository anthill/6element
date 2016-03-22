'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');
var categories = require('../management/declarations.js').categories;

module.exports = {
    createByChunk: function (datas) {
        return databaseP.then(function (db) {

            return Promise.all(datas.map(function(data){

                var query = categories
                    .insert(data)
                    .returning('*')
                    .toQuery();
                return new Promise(function (resolve, reject) {
                    db.query(query, function (err, result) {
                        if (err) {
                            console.log("ERROR in saving entry", query);
                            reject(err);
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
            
            var query = categories
                .select('*')
                .order(categories.name)
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
    }
};
