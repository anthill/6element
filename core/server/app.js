"use strict";

require('es6-shim');
require('better-log').install();

var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var compression = require('compression');
var bodyParser = require('body-parser');
var net = require('net');
var makeTcpReceiver = require('./makeTcpReceiver');

var database = require('../database');
var datasetParser = require('./readDataset.js')

var PORT = 4000;
var DEBUG = process.env.NODE_ENV === "development" ? true : false;

var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;

var realDatas; // Set by loadDataSet().

var measurementNormalizer = {}; // Set in app.get(/place/:id)

var endpointConfig =
    {
        host: process.env.ENDPOINT_PORT_5100_TCP_ADDR ? process.env.ENDPOINT_PORT_5100_TCP_ADDR : "127.0.0.1",
        port: process.env.INTERNAL_PORT ? process.env.INTERNAL_PORT : 55555
    };

var debug = function() {
    if (DEBUG) {
        [].unshift.call(arguments, "[DEBUG 6element] ");
        console.log.apply(console, arguments);
    }
}

var server = new http.Server(app);

var io = require('socket.io')(server);

io.set('origins', '*:*');


// Load the real-data dataset
loadDataset();

// listening to the reception server
var endpointInterval = setInterval(function() {
    var tcpSocketEnpoint = net.connect(endpointConfig, function(){

        debug('connected to the reception server on '+ tcpSocketEnpoint.remoteHost+':'+tcpSocketEnpoint.remotePort);

        var tcpSocketEndpointReceiver = makeTcpReceiver(tcpSocketEnpoint, "\n");

        tcpSocketEndpointReceiver.on('message', function(message) {
            
            var packet = JSON.parse(message);

            if (packet.type === 'data') {
                io.sockets.emit('data', packet.data); // Forwarding data to web clients, TODO : delete useless signals
            }

        })
            
    });

    tcpSocketEnpoint.on('error', function(err) {
        console.log('[ERROR]: INTERNAL SOCKET : ' + err.message);
    });

    tcpSocketEnpoint.on('connect', function() {
        console.log('connection')
        clearInterval(endpointInterval);
    });
}, 5000);

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

app.get('/place/:id', function(req, res){
    var id = Number(req.params.id);
    
    database.complexQueries.getPlaceMeasurements(id)
    .then(function(data){

        if (!measurementNormalizer[id]) {
            var sum = 0;
            var nbMeasurements = 0;
            data.forEach(function (measurement) {
                console.log('measurement :', measurement)
                var hourOfDay = measurement.measurement_date.getTime() % DAY;
                if (hourOfDay >= 12*HOUR+15*MINUTE && hourOfDay < 13*HOUR+45*MINUTE) {
                    sum += measurement.signal_strengths.reduce(function(prev, current) {
                        return prev + current;
                    });
                    nbMeasurements += measurement.signal_strengths.length;
                }
            })
            measurementNormalizer[id] = sum / nbMeasurements;
            console.log('measurementNormalizer for id = ' + id + ' :', measurementNormalizer[id])
        }

        if (!realDatas || !realDatas[id])
            res.send(data);
        else {
            var toSend = [];

            data = data.concat(realDatas[id]);
            data.sort(function (data1, data2) {
                return data1.measurement_date.getTime() - data2.measurement_date.getTime();
            })

            var i = 0;
            var lastMeasurementDate = new Date(0);
            data.forEach(function (measurement) {
                if (!measurement.real) { // measurement
                    lastMeasurementDate = measurement.measurement_date;
                    toSend.push({
                        id: id,
                        measurement_date: measurement.measurement_date,
                        measurement: getMeasurementLength(id, measurement),
                        realMeasurement: i
                    });
                    i = 0;
                }
                else { // real value
                    if (measurement.measurement_date - lastMeasurementDate >= 10 * MINUTE) {  // 10 minutes without measurement
                        toSend.push({
                            id: id, 
                            measurement_date: measurement.measurement_date, 
                            measurement: null,
                            realMeasurement: i
                        });
                        lastMeasurementDate = measurement.measurement_date;
                        i = 0;
                    }
                    ++i;
                }
            })
            res.send(toSend);
        }
    })
    .catch(function(error){
        console.log("error in /recycling-center/'+req.params.id: ", error);
    });
});

app.get('/sensors', function(req, res){
    database.Sensors.getAllSensors()
    .then(function(data){
        // debug('All sensors', data);
        res.send(data);
    })
    .catch(function(error){
        console.log("error in /sensors: ", error);
    });
});

app.get('/reloadDataset', function(req, res) {
    loadDataset()
    .then(function () {
        res.send('done');
    })
    .catch(function (err) {
        res.send('error : ', err)
    })
})

server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});



// Load the real dataset.
function loadDataset() {
    var datasByID = {};

    var PCsv = datasetParser.readDataset()
    .catch(function (err) {
        console.log('ERROR in dataset parsing:', err)
    })
    
    // return all the places in the DB in order to create a map name->id
    var PPlaces = database.complexQueries.getAllPlacesInfos()
    .catch(function (err) {
        console.log('Error while retrieving the database :', err)
    })
    
    return Promise.all([PCsv, PPlaces])
    .then(function(results) {
        debug('DB and dataset retrieved')
        var dataset = results[0];
        var places = results[1];
    
        var nameToID = {};
    
        places.forEach(function (place) {
            nameToID[datasetParser.removeAccents(place.name.toLowerCase())] = place.id;
        })
    
        var lastData;

        // Cut the dataset into little arrays by place ID
        dataset.forEach(function(data) {
            if (!data) return;
            if (!lastData || lastData.md5 !== data.md5) {
                if (!data.place || !nameToID[data.place] || datasByID[nameToID[data.place]] === undefined) {
                    datasByID[nameToID[data.place]] = [];
                }
                datasByID[nameToID[data.place]].push(
                    {
                        measurement_date: new Date(data.date.getTime() - 2 * HOUR), // Convert to UTC
                        real: true
                    });
                lastData = data;
            }
        })
    
        // Sort each array by date
        Object.keys(datasByID).forEach(function (key) {
            datasByID[key].sort(function (data1, data2) {
                return data1.measurement_date.getTime() - data2.measurement_date.getTime();
            })
        })
        realDatas = datasByID; // Change the global variable ... Erk ...
        debug('dataset loaded')
    })
    .catch(function (err) {
        console.log('ERROR :', err)
    })
}

function getMeasurementLength(id, measurement) {
    var length = 0;

    if (!measurementNormalizer[id])
        return (measurement.measurement);
    measurement.signal_strengths.forEach(function (signal) {
        if (signal > measurementNormalizer[id])
            ++length;
    })
    return length;
}

// In dev, there are usually no sensor pushing.
// Let's simulate that part
// if(process.env.NODE_ENV === 'development'){
//     simulateSensorMeasurementArrival();
// }
