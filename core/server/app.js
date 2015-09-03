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
var EventEmitter = require('events').EventEmitter;

var database = require('../database');
var datasetParser = require('./readDataset.js')

var model = require('./appModel.js');

var PORT = 4000;
var DEBUG = process.env.NODE_ENV === "development" ? true : false;

var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;

var eventEmitter = new EventEmitter();

var realDatas; // Set by loadDataSet().

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

// train the model
eventEmitter.on('datasetLoaded', function() {
    model.train(realDatas);
});

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
    .then(function(measurements){

        if (!realDatas || !realDatas[id]) {
            debug('no entries for id', id, 'in the dataset. Sending only measurements')
            res.send(measurements);
        }
        else {
            var toSend = mixMeasurementsAndRealValues(measurements, realDatas[id], id);

            toSend.forEach(function (data) {
                data.measurement = model.forward(data);
                // data.measurement = data.signal_strengths ? data.signal_strengths.length : null;
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


// mix measurements and real values from the dataset for one place ID
function mixMeasurementsAndRealValues(measurements, realValues, id) {
    var toSend = [];
    var everything = [];

    // Make an array with everything
    everything = everything.concat(measurements);
    everything = everything.concat(realValues);

    // Sort by date
    everything.sort(function (data1, data2) {
        return data1.measurement_date.getTime() - data2.measurement_date.getTime();
    })

    var nbRealValues = 0;
    var lastMeasurementDate = new Date(0);

    // Pass throught this array
    everything.forEach(function (data) {
        if (!data) return;
        if (!data.real) { // If the data is a measurement
            lastMeasurementDate = data.measurement_date;
            // Add to the final array
            toSend.push({
                id: id,
                measurement_date: data.measurement_date,
                measurement: data.signal_strengths.length,
                signal_strengths: data.signal_strengths,
                realMeasurement: nbRealValues
            });
            nbRealValues = 0;
        }
        else { // If the data is a real value
            if (data.measurement_date - lastMeasurementDate >= 10 * MINUTE) {  // 10 minutes without measurement
                toSend.push({
                    id: id, 
                    measurement_date: data.measurement_date, 
                    measurement: null, // Not 0, because dygraphs handle null as 'no data'
                    realMeasurement: nbRealValues
                });
                lastMeasurementDate = data.measurement_date;
                nbRealValues = 0;
            }
            ++nbRealValues;
        }
    })

    return (toSend) 
    // Array of Objects : [{id, measurementDate, measurement, signal_strengths, realMeasurement}, ...]
}




// Load the real dataset.
function loadDataset(_path) {
    var datasByID = {};

    _path = _path || '/6element/data/all_data.csv';

    var PCsv = datasetParser.readDataset(_path)
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
            if (!data || !data.place || nameToID[data.place] === undefined) return;
            // Don't save two adjacent datas with the same md5 hash 
            if (!lastData || lastData.md5 !== data.md5) {
                if (datasByID[nameToID[data.place]] === undefined) {
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
        realDatas = datasByID; // Change the global variable
        debug('dataset loaded')
        eventEmitter.emit('datasetLoaded');
    })
    .catch(function (err) {
        console.log('ERROR :', err)
    })
}

// In dev, there are usually no sensor pushing.
// Let's simulate that part
// if(process.env.NODE_ENV === 'development'){
//     simulateSensorMeasurementArrival();
// }

