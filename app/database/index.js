"use strict";

var decl = require('./management/declarations.js');
var databaseP = require('./management/databaseClientP');

var places = decl.places;
var sensor = decl.sensors;
var sensorMeasurement = decl.affluence_sensor_measurements;

module.exports = {
    Places: require('./models/places.js'),
    Sensors: require('./models/sensors.js'),
    SensorMeasurements: require('./models/sensor-measurements.js'),
    complexQueries: {
        currentPlaceAffluences: function(){
            return databaseP.then(function(db) {
                /*
                    For each place, get the last measurement date
                */
                var latestPlaceMeasurementDate = places
                    .subQuery('latest_recycling_center_measurement_date')
                    .select(
                        places.id,
                        sensorMeasurement.measurement_date.max().as('last_date')
                    )
                    .from(
                        places
                            .join(sensor
                                .join(sensorMeasurement)
                                .on(sensor.id.equals(sensorMeasurement.sensor_id)))
                            .on(places.id.equals(sensor.installed_at))
                    )
                    .group(places.id, sensor.id);
                
                /*
                    For each recycling center, get the measurement value associated to the last measurement date
                */
                var latestPlaceMeasurementValue = places
                    .subQuery('latest_recycling_center_measurement_value')
                    .select(
                        places.id,
                        sensorMeasurement
                            .literal('array_length(affluence_sensor_measurements.signal_strengths, 1)')
                            .as('latest')
                    )
                    .from(
                        places
                            .join(sensor
                                .join(sensorMeasurement)
                                .on(sensor.id.equals(sensorMeasurement.sensor_id)))
                            .on(places.id.equals(sensor.installed_at))
                            .join(latestPlaceMeasurementDate)
                            .on(places.id.equals(latestPlaceMeasurementDate.id).and(
                                latestPlaceMeasurementDate.last_date.equals(sensorMeasurement.measurement_date)
                            ))
                    );
                
                /*
                    For each recycling center, get the maximum measurement (and recycling center infos)
                    TODO restrict maximum to the last few months
                */
                var maxMeasurementPerPlace = places
                    .subQuery('max_measurement_per_recycling_center')
                    .select(
                        places.id, places.name, places.lat, places.lon,
                        'max(array_length(affluence_sensor_measurements.signal_strengths, 1))'
                    )
                    .from(
                        places
                            .join(sensor
                                .join(sensorMeasurement)
                                .on(sensor.id.equals(sensorMeasurement.sensor_id)))
                            .on(places.id.equals(sensor.installed_at))
                    )
                    .group(places.id, sensor.id);
                
                /*
                    For each recycling center, get
                    * recycling center infos (long lat)
                    * maximum number of signals
                    * latest measured number of signals
                */
                var query = places
                    .select('*')
                    .from(maxMeasurementPerPlace
                        .join(latestPlaceMeasurementValue)
                        .on(maxMeasurementPerPlace.id.equals(latestPlaceMeasurementValue.id))
                    )
                    .toQuery();
                
                // console.log('currentPlaceAffluences query', query);

                return new Promise(function (resolve, reject) {
                    db.query(query, function (err, result) {
                        if (err) reject(err);
                        else resolve(result.rows);
                    });
                });
            });
            
        },
        
        getPlaceDetails: function(rcId){
            return databaseP.then(function(db){

                var query = sensor
                    .select(
                        sensor.id,
                        sensorMeasurement.measurement_date,
                        sensorMeasurement
                            .literal('array_length(affluence_sensor_measurements.signal_strengths, 1)')
                            .as('measurement')
                    )
                    .from(
                        sensor
                            .join(sensorMeasurement)
                            .on(sensor.id.equals(sensorMeasurement.sensor_id))
                    )
                    .where(sensor.installed_at.equals(rcId))
                    .toQuery();
                
                return new Promise(function (resolve, reject) {
                    db.query(query, function (err, result) {
                        if (err) reject(err);
                        else resolve(result.rows);
                    });
                });
            })

        }
    }
};
