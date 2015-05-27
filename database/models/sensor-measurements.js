"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var sensorMesurements = sql.define({
    name: 'sensor_measurements',
    columns: ['id', 'sensor_id', 'amount', 'measurement_date']
});

module.exports = {
    create: function (data) {
        return databaseP.then(function (db) {
            
            var query = sensorMesurements
                .insert(data)
                .returning('id')
                .toQuery();

            console.log('sensorMesurements create query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0].id);
                });
            });
        })
    }
};