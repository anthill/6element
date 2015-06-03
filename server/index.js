"use strict";

require('es6-shim');
require('better-log').install();

var hardCodedSensors = require("./hardCodedSensors.js");
var decoder = require('6sense/js/codec/decodeFromSMS.js');

var path = require('path');
var express = require('express');
var app = express();
var compression = require('compression');
var bodyParser = require('body-parser');


var errlog = function(str){
    return function(err){
        console.error(str, err.stack);
    }
}
 
var fs = require('fs');

var PORT = 4000;

var database = require('../database');
var dropAllTables = require('../database/management/dropAllTables');
var createTables = require('../database/management/createTables');
var fillDBWithFakeData = require('./fillDBWithFakeData.js');

function rand(n){
    return Math.floor(n*Math.random());
}

dropAllTables()
    .then(createTables)
    //.then(fillDBWithFakeData)
    .then(hardCodedSensors)
    .catch(errlog('drop and create'));


app.use(compression());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/css/leaflet.css", express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));
app.use("/css", express.static(path.join(__dirname, '../client/css')));
app.use("/images", express.static(path.join(__dirname, '../client/images')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.get('/browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../client/browserify-bundle.js'));
});


app.get('/live-affluence', function(req, res){
    database.complexQueries.currentRecyclingCenterAffluences()
        .then(function(data){
            res.send(data);
        })
        .catch(errlog('/live-affluence'));
    
});

// endpoint receiving the sms from twilio
app.post('/twilio', function(req, res) {

    console.log("Received sms");

    // find sensor id by phone number
    database.Sensors.findByPhoneNumber(req.body.From)
        .then(function(sensor){
            if (req.body.Body !== undefined){
                    // decode message
                    decoder(req.body.Body)
                        .then(function(decodedMsg){

                            // [{"date":"2015-05-20T13:48:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:49:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:50:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:51:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:52:00.000Z","signal_strengths":[]}]

                            Promise.all(decodedMsg.map(function(message){

                                // persist message in database
                                return database.SensorMeasurements.create({
                                    'sensor_id': sensor.id,
                                    'signal_strengths': message.signal_strengths,
                                    'measurement_date': message.date
                                });

                            }))
                            .then(function(msg){
                                console.log("Storage SUCCESS");
                                res.json("OK");
                            })
                            .catch(function(msg){
                                console.log("Storage FAILURE: " + msg);
                                res.json("FAIL");
                            });
                        })
                }
        });

});

app.get('/recycling-center/:rcId', function(req, res){
    var rcId = Number(req.params.rcId);
    
    database.complexQueries.getRecyclingCenterDetails(rcId)
        .then(function(data){
            res.send(data);
        })
        .catch(errlog('/recycling-center/'+req.params.rcId));
});


app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});
