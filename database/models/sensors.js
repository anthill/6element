"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var sensors = sql.define({
    name: 'sensors',
    columns: ['id', 'name']
});

module.exports = {
    create: function (data) {
        return databaseP.then(function (db) {
            
            var query = sensors
                .insert({
                    name: 'bla'
                })
                .returning('id')
                .toQuery();

            console.log('sensors create query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0].id);
                });
            });
        })
    }
};