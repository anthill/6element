'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var connectToDB = require('../management/connectToDB.js');

var networks = require('../management/declarations.js').networks;

module.exports = {
    createByChunk: function (datas) {
        return connectToDB().then(function (db) {

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
};
