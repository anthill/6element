"use strict";

var moment = require('moment');

var database = require('../database');


var BORDEAUX_COORDS = [44.84, -0.57];
var BM_CITIES = [
    "Bordeaux","Ambarès-et-Lagrave","Ambès","Artigues-près-Bordeaux","Bassens","Bègles","Blanquefort","Bouliac","Bruges","Carbon-Blanc","Cenon","Eysines","Floirac","Gradignan","Le Bouscat","Le Haillan","Le Taillan-Médoc","Lormont","Martignas-sur-Jalle","Mérignac","Parempuyre","Pessac","Saint-Aubin-de-Médoc","Saint-Louis-de-Montferrand","Saint-Médard-en-Jalles","Saint-Vincent-de-Paul","Talence","Villenave-d'Ornon"
];

function rand(max, min){
    min = min !== undefined ? min : 0;
    max = max !== undefined ? max : 100;
    
    return Math.round(min + (max - min)*Math.random());
}

var DIST = 0.1;
var recyclingCenters = BM_CITIES.map(function(name, i){
    var max = 50 + rand(50);

    return {
        
        max: max,
        current: rand(max),
        name: name,
        id: i
    }
});

function generateRecyclingCenters(){
    return Promise.all(BM_CITIES.map(function(name){
        return database.RecyclingCenters.create({
            name: name,
            // random location around Bordeaux
            lat: BORDEAUX_COORDS[0] + 2*DIST*Math.random() - DIST,
            lon: BORDEAUX_COORDS[1] + 2*DIST*Math.random() - DIST
        });
    }));
}

// create one sensor per recylcing center
function generateSensors(recyclingCenterIds){
    return Promise.all(recyclingCenterIds.map(function(rcId, i){
        return database.Sensors.create({
            name: 'sensor '+i,
            installed_at: rcId,
            phone_number: "xxx"+i,
            quipu_status: 'uninitialized'
            // sense_status: 'NULL',
            // latest_input: 'NULL',
            // latest_output: 'NULL'
        });
    }));
}

function generateSensorMeasurements(sensorIds){
    var now = moment();
    
    // for each sensor, generate 10 measurements at 5mins interval each starting 
    // query will pick the latest
    
    return Promise.all(sensorIds.map(function(sensorId){
        var sensorMax = 30 + rand(70);
        
        return Promise.all(Array(10).fill().map(function(e, i){
            var date = now.clone().subtract(5*i, 'minutes');
            
            return database.SensorMeasurements.create({
                'sensor_id': sensorId,
                'signal_strengths': Array(rand(sensorMax)).fill().map(function(){
                    return Math.round(rand(100)) - 100;
                }),
                'measurement_date': date.toISOString()
            });
        }))
    }));
    
}


module.exports = function(){
    return generateRecyclingCenters()
        .then(generateSensors)
        .then(generateSensorMeasurements);
}




