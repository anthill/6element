"use strict";

var decl = require('./management/declarations.js');
var databaseP = require('./management/databaseClientP');


var recyclingCenter = decl.recycling_centers;
var sensor = decl.sensors;
var sensorMeasurement = decl.affluence_sensor_measurements;

var errlog = function(str){
    return function(err){
        console.error(str, err, err.stack);
    }
}

module.exports = {
    RecyclingCenters: require('./models/recycling-centers.js'),
    Sensors: require('./models/sensors.js'),
    SensorMeasurements: require('./models/sensor-measurements.js'),
    complexQueries: {
        currentRecyclingCenterAffluences: function(){
            return databaseP.then(function(db) {
                // This has no good reason to be in 2 queries, but SQL is hard
                
                var latestRecyclingCenterMeasurementDate = recyclingCenter
                    .subQuery('latest_recycling_center_measurement_date')
                    .select(
                        recyclingCenter.id,
                        sensorMeasurement.measurement_date.max().as('last_date')
                    )
                    .from(
                        recyclingCenter
                            .join(sensor
                                .join(sensorMeasurement)
                                .on(sensor.id.equals(sensorMeasurement.sensor_id)))
                            .on(recyclingCenter.id.equals(sensor.installed_at))
                    )
                    .group(recyclingCenter.id, sensor.id);
                
                
                var latestRecyclingCenterMeasurementValue = recyclingCenter
                    .subQuery('latest_recycling_center_measurement_value')
                    .select(
                        recyclingCenter.id,
                        sensorMeasurement
                            .literal('array_length(affluence_sensor_measurements.signal_strengths, 1)')
                            .as('latest')
                    )
                    .from(
                        recyclingCenter
                            .join(sensor
                                .join(sensorMeasurement)
                                .on(sensor.id.equals(sensorMeasurement.sensor_id)))
                            .on(recyclingCenter.id.equals(sensor.installed_at))
                            .join(latestRecyclingCenterMeasurementDate)
                            .on(recyclingCenter.id.equals(latestRecyclingCenterMeasurementDate.id).and(
                                latestRecyclingCenterMeasurementDate.last_date.equals(sensorMeasurement.measurement_date)
                            ))
                    );
                
                var maxMeasurementPerRecyclingCenter = recyclingCenter
                    .subQuery('max_measurement_per_recycling_center')
                    .select(
                        recyclingCenter.id, recyclingCenter.name, recyclingCenter.lat, recyclingCenter.lon,
                        'max(array_length(affluence_sensor_measurements.signal_strengths, 1))'
                    )
                    .from(
                        recyclingCenter
                            .join(sensor
                                .join(sensorMeasurement)
                                .on(sensor.id.equals(sensorMeasurement.sensor_id)))
                            .on(recyclingCenter.id.equals(sensor.installed_at))
                    )
                    .group(recyclingCenter.id, sensor.id);
                
                
                var query = recyclingCenter
                    .select('*')
                    .from(maxMeasurementPerRecyclingCenter
                        .join(latestRecyclingCenterMeasurementValue)
                        .on(maxMeasurementPerRecyclingCenter.id.equals(latestRecyclingCenterMeasurementValue.id))
                    )
                    .toQuery();
                
                
                
                console.log('currentRecyclingCenterAffluences query', query);

                return new Promise(function (resolve, reject) {
                    db.query(query, function (err, result) {
                        if (err) reject(err);
                        else resolve(result.rows);
                    });
                });
            });
            
        }
    }
};
