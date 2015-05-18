"use strict";

require('es6-shim');

var dropAllTables = require('../database/management/dropAllTables');
var createTables = require('../database/management/createTables');

var database = require('../database');

function rand(n){
    return Math.floor(n*Math.random());
}

// if(process.env.NODE_ENV !== "production") // commented for now. TODO Find proper way to handle both prod & dev envs
dropAllTables()
    .then(createTables)
    .then(function(){
        return database.Sensors.create({
            name: 'bla'
        })
        .then(function(sensorId){
            setInterval(function(){
                database.SensorMeasurements.create({
                    'sensor_id': sensorId,
                    'signal_strengths': Array(rand(40)).fill().map(function(){
                        return Math.round(rand(100)) - 100;
                    }),
                    'measurement_date': (new Date()).toISOString()
                })
                    .then(function(res){
                        console.log('SensorMeasurements success!', res);
                    })
                    .catch(function(err){
                        console.error('SensorMeasurements error', err);
                    });
            }, 5000)
        })
    })
    .then(function(res){
        console.log('sensor success!', res);
    })
    .catch(function(err){
        console.error('sensor error', err);
    });






