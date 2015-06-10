"use strict";

require('es6-shim');
require('better-log').install();

var fs = require('fs');

var hardCodedSensors = require("./hardCodedSensors.js");
var decoder = require('6sense/js/codec/decodeFromSMS.js');

var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var compression = require('compression');
var bodyParser = require('body-parser');
var xml = require('xml');

var errlog = function(str){
    return function(err){
        console.error(str, err.stack);
    }
}
 

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
    // .then(fillDBWithFakeData)
    .then(hardCodedSensors)
    .catch(errlog('drop and create'));

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

app.use("/css/leaflet.css", express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));
app.use("/socket.io.js", express.static(path.join(__dirname, '../node_modules/socket.io/node_modules/socket.io-client/socket.io.js')));
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


var socketMessage;

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

                            var messageContent = {
                                'sensor_id': sensor.id,
                                'signal_strengths': message.signal_strengths,
                                'measurement_date': message.date
                            };
                            socketMessage = messageContent;

                            // persist message in database
                            var persitP = database.SensorMeasurements.create(messageContent);
                            socketMessage['installed_at'] = sensor.installed_at;
                            return persitP;

                        }))
                        .then(function(id){
                            console.log("Storage SUCCESS");
                            res.set('Content-Type', 'text/xml');
                            res.send(xml({"Response":""}));

                            // SOCKET IO
                            if (socket){
                                socket.emit('data', socketMessage);
                            }

                        })
                        .catch(function(id){
                            console.log("Storage FAILURE: " + id);
                            res.set('Content-Type', 'text/xml');
                            res.send(xml({"Response":""}));
                        });
                    });
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

// io.on('connection', function(socket) {
//     console.log('Socket io Connexion');

//     setInterval(function(){
//         console.log('emitting', Math.floor(Math.random() * 28));
//         socket.emit('data', {
//             sensor_id: Math.floor(Math.random() * 28),
//             signal_strengths: [10, 10, 10],
//             measurement_date: new Date()
//         });
//     }, 2000);
// });

server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});

