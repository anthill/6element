"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var affluenceSensorMeasurements = sql.define({
    name: 'affluence_sensor_measurements',
    columns: ['id', 'sensor_id', 'signal_strengths', 'measurement_date']
});

module.exports = {
    create: function (data) {
        return databaseP.then(function (db) {
            
            var query = affluenceSensorMeasurements
                .insert(data)
                .returning('id')
                .toQuery();

            //console.log('sensorMesurements create query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0].id);
                });
            });
        })
    }
};