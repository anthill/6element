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

dropAllTables()
    .then(createTables)
    // .then(fillDBWithFakeData)
    .then(hardCodedSensors)
    .catch(function(error){
            console.log("error in drop and create: ", error);
        });

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
app.use("/socket.io.js", express.static(path.join(__dirname, '../../node_modules/socket.io/node_modules/socket.io-client/socket.io.js')));
app.use("/Map", express.static(path.join(__dirname, '../clients/Map')));
app.use("/Admin", express.static(path.join(__dirname, '../clients/Admin')));
app.use("/_common", express.static(path.join(__dirname, '../clients/_common')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/Map/index.html'));
});

app.get('/Admin', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/Admin/index.html'));
});

app.get('/Map_app.js', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/Map_app.js'));
});

app.get('/Admin_app.js', function(req, res){
    // send sms to sensors to ask them their status
    database.Sensors.getAllSensors()
        .then(function(sensors){
            sensors.forEach(function(sensor){
                sendSMS("status", sensor.phone_number);
            });
        })
        .catch(function(error){
            console.log("error in sending status sms ", error);
        });
    res.sendFile(path.join(__dirname, '../clients/Admin_app.js'));
});

app.get('/live-affluence', function(req, res){
    database.complexQueries.currentRecyclingCenterAffluences()
        .then(function(data){
            res.send(data);
        })
        .catch(function(error){
            console.log("error in /live-affluence: ", error);
        });
    
});

// endpoint receiving the sms from twilio
app.post('/twilio', function(req, res) {

    debug("Received sms from ", req.body.From, req.body.Body);

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
                            return database.Sensors.update(sensor, {
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
    
    database.complexQueries.getRecyclingCenterDetails(rcId)
        .then(function(data){
            res.send(data);
        })
        .catch(function(error){
            console.log("error in /recycling-center/'+req.params.rcId: ", error);
        });
});

app.get('/sensors', function(req, res){
    database.Sensors.getAllSensors()
        .then(function(data){
            debug('All sensors', data);
            res.send(data);
        })
        .catch(function(error){
            console.log("error in /sensors: ", error);
        });
});

// io.on('connection', function(socket) {
//     console.log('Socket io Connexion');

//     setInterval(function(){
//         var id = Math.floor(Math.random() * 28);
//         console.log('emitting', id);
//         socket.emit('status', {
//             sensorId: id,
//             socketMessage: {
//                 quipu_status: 'sleeping'
//             }
//         });
//     }, 2000);
// });


server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});


// // USE TO SIMULATE A MEASUREMENT SENDING TO SERVER FROM SENSOR

// var encodeForSMS = require('6sense/src/codec/encodeForSMS.js');
// var request = require('request');

// setInterval(function(){

//     var now = new Date().toISOString();

//     var result = {
//         date: now,
//         signal_strengths: new Array(23, 12, 53)
//     };

//     console.log('new measure', result.signal_strengths.length);

//     encodeForSMS([result]).then(function(sms){

//         var toSend = {
//             From: '+33781095259', // this is sensor 1
//             Body: '1' + sms
//         };
        
//         request.post({
//             rejectUnauthorized: false,
//             url: 'http://192.168.59.103:4000/twilio',
//             headers: {
//                'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(toSend)
//         }, function(error, response, body){
//             if(error) {
//                console.log("ERROR:", error);
//             } else {
//                debug(response.statusCode, body);
//             }
//         });
//     });

// }, 2000);

