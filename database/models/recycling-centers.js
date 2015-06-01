"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var recyclingCenters = require('../management/declarations.js').recycling_centers;

module.exports = {
    create: function (data) {
        return databaseP.then(function (db) {
            
            var query = recyclingCenters
                .insert(data)
                .returning('id')
                .toQuery();

            //console.log('recyclingCenters create query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0].id);
                });
            });
        })
    }
};
