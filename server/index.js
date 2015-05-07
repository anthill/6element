"use strict";

require('es6-shim');

var dropAllTables = require('../database/management/dropAllTables');
var createTables = require('../database/management/createTables');

var database = require('../database');

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
                    'amount': Math.round(Math.random()*100),
                    'measurement_date': (new Date()).toISOString()
                })
                    .then(function(res){
                        console.log('SensorMeasurements success!', res);
                    })
                    .catch(function(err){
                        console.error('SensorMeasurements error', err);
                    });
            }, 3000)
        })
    })
    .then(function(res){
        console.log('sensor success!', res);
    })
    .catch(function(err){
        console.error('sensor error', err);
    })

