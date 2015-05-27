"use strict";

module.exports = {
    RecyclingCenters: require('./models/recycling-centers.js'),
    Sensors: require('./models/sensors.js'),
    SensorMeasurements: require('./models/sensor-measurements.js'),
    complexQueries: {
        currentRecyclingCenterAffluences: function(){
            /*
                for all recycling centers,
                    find the sensor,
                        for each sensor,
                            find the most recent measurement
                            
                recyclingCenters
                    .select(recyclingCenter.star(), )
                    .from(recyclingCenter, sensor, sensorMeasurement)
                    .toQuery();
            */
        }
    }
};
