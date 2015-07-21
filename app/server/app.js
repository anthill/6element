"use strict";

require('es6-shim');
require('better-log').install();

var fs = require('fs');
var quipuParser = require('quipu/parser.js');

var hardCodedSensors = require("./hardCodedSensors.js");
var decoder = require('6sense/src/codec/decodeFromSMS.js');

var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var compression = require('compression');
var bodyParser = require('body-parser');
var xml = require('xml');

var database = require('../database');
var dropAllTables = require('../database/management/dropAllTables');
var createTables = require('../database/management/createTables');
var fillDBWithFakeData = require('./fillDBWithFakeData.js');
var simulateSensorMeasurementArrival = require('./simulateSensorMeasurementArrival')

var sendSMS = require('./sendSMS.js');

var PORT = 4000;
var DEBUG = process.env.DEBUG ? process.env.DEBUG : false;

var debug = function() {
    if (DEBUG) {
        [].unshift.call(arguments, "[DEBUG 6element] ");
        console.log.apply(console, arguments);
    };
}

function rand(n){
    return Math.floor(n*Math.random());
}


var server = http.Server(app);
var io = require('socket.io')(server);

io.set('origins', '*:*');

var socket = false;

io.on('connection', function(_socket) {
    socket = _socket;
});


app.use(compression());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/leaflet.css", express.static(path.join(__dirname, '../../node_modules/leaflet/dist/leaflet.css')));

app.use("/dygraph-combined.js", express.static(path.join(__dirname, '../../node_modules/dygraphs/dygraph-combined.js')));
app.use("/App", express.static(path.join(__dirname, '../clients/App')));
app.use("/_common", express.static(path.join(__dirname, '../clients/_common')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/App/index.html'));
});

app.get('/App-browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/App-browserify-bundle.js'));
});

app.get('/live-affluence', function(req, res){
    database.complexQueries.currentPlaceAffluences()
        .then(function(data){
            res.send(data);
        })
        .catch(function(error){
            console.log("error in /live-affluence: ", error);
        });
    
});

// endpoint receiving the sms from twilio
app.post('/twilio', function(req, res) {

    console.log("Received sms from ", req.body.From, req.body.Body);

    // find sensor id by phone number
    database.Sensors.findByPhoneNumber(req.body.From)
        .then(function(sensor){
            if (sensor){
                debug("Found corresponding sensor: ", sensor);

                var header = req.body.Body[0];
                var body = req.body.Body.substr(1);
                

                switch (header){
                    
                    // clear message
                    case '0':
                        debug('Received clear message');
                        switch(body) {
                            case "init":
                                debug("Received init");
                                var date = new Date();
                                sendSMS("date:" + date.toISOString(), req.body.From);
                                break;
                        }
                        break;

                    // 6sense encoded message
                    case '1':
                        decoder(body)
                            .then(function(decodedMsg){

                                debug("decoded msg ", decodedMsg);

                                // [{"date":"2015-05-20T13:48:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:49:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:50:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:51:00.000Z","signal_strengths":[]},{"date":"2015-05-20T13:52:00.000Z","signal_strengths":[]}]
                                Promise.all(decodedMsg.map(function(message){
                                    var messageContent = {
                                        'sensor_id': sensor.id,
                                        'signal_strengths': message.signal_strengths,
                                        'measurement_date': message.date
                                        // 'quipu_signal_strength': message.quipu.signalStrength
                                    };
                                    debug("decoded msg ", message);
                                    var socketMessage = Object.assign({}, messageContent);
                                    socketMessage['installed_at'] = sensor.installed_at;

                                    // persist message in database

                                    return database.SensorMeasurements.create(messageContent).then(function(id){
                                        return {
                                            sensorMeasurementId: id,
                                            measurement: socketMessage
                                        };
                                    });                                    
                                }))
                                .then(function(results){
                                    debug("Storage SUCCESS");
                                    res.set('Content-Type', 'text/xml');
                                    res.send(xml({"Response":""}));

                                    // SOCKET IO
                                    if (socket)
                                        socket.emit('data', results);
                                    
                                })
                                .catch(function(error){
                                    console.log("Storage FAILURE: ", error);
                                    res.set('Content-Type', 'text/xml');
                                    res.send(xml({"Response":""}));
                                });
                            });
                        break;

                    // regular encoded message
                    case '2':
                        quipuParser.decode(body)
                        .then(function(sensorStatus){
                            return database.Sensors.update(sensor.id, {
                                latest_input: sensorStatus.info.command,
                                latest_output: sensorStatus.info.result,
                                quipu_status: sensorStatus.quipu.state,
                                sense_status: sensorStatus.sense
                            })
                            .then(function(){
                                debug('id', sensor.id);

                                return {
                                    sensorId: sensor.id,
                                    socketMessage: sensorStatus
                                };
                            });
                        })
                        .then(function(result){
                            debug("Storage SUCCESS");
                            res.set('Content-Type', 'text/xml');
                            res.send(xml({"Response":""}));

                            // SOCKET IO
                            if (socket)
                                socket.emit('status', result);
                            
                        })
                        .catch(function(error){
                            console.log("Storage FAILURE: ", error);
                            res.set('Content-Type', 'text/xml');
                            res.send(xml({"Response":""}));
                        });
                        break;

                    default:
                        console.log('Error: message has not type character');
                }
            } else {
                console.log("No sensor corresponding to this number.");
            }
        })
        .catch(function(error){
            console.log("Error in findByPhoneNumber: ", error);
        });   
});



app.get('/recycling-center/:rcId', function(req, res){
    var rcId = Number(req.params.rcId);
    
    database.complexQueries.getPlaceDetails(rcId)
        .then(function(data){
            res.send(data);
        })
        .catch(function(error){
            console.log("error in /recycling-center/'+req.params.rcId: ", error);
        });
});

app.get('/sensors', function(req, res){
    database.Sensors.getAllSensorsInfo()
        .then(function(data){
            // debug('All sensors', data);
            res.send(data);
        })
        .catch(function(error){
            console.log("error in /sensors: ", error);
        });
});

app.post('/updateRC', function(req, res){
    var rcId = Number(req.params.rcId);
    
    database.Places.update(rcId, {
        name: req.params.name,
        lat: req.params.lat,
        lon: req.params.lon
    })
    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        console.log("error in /recycling-center/'+req.params.rcId: ", error);
    });
});


server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});



// In dev, there are usually no sensor pushing.
// Let's simulate that part
if(process.env.NODE_ENV === 'development'){
    simulateSensorMeasurementArrival();
}


