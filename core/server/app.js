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

// var realDatas; // Set in the promise.all at the end of the file.

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

// listening to the reception server
var endpointInterval = setInterval(function() {
    var tcpSocketEnpoint = net.connect(endpointConfig, function(){

        debug('connected to the reception server on '+ tcpSocketEnpoint.remoteHost+':'+tcpSocketEnpoint.remotePort);

        var tcpSocketEndpointReceiver = makeTcpReceiver(tcpSocketEnpoint, "\n");

        tcpSocketEndpointReceiver.on('message', function(message) {
            
            var packet = JSON.parse(message);

            if (packet.type === 'data') {
                io.sockets.emit('data', packet.data); // Forwarding data to web clients
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
        res.send(data);
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

server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});







// Load the real dataset.

var PCsv = datasetParser.readDataset()
.catch(function (err) {
    console.log('ERROR in dataset parsing:', err)
})

// return all the places in the DB in order to create a map name->id
var PPlaces = database.complexQueries.getAllPlacesInfos()
.catch(function (err) {
    console.log('ERROR in database retrieving:', err)
})

Promise.all([PCsv, PPlaces])
.then(function(results) {
    debug('DB and dataset retrieved')
    var dataset = results[0];
    var places = results[1];

    var nameToID = {};

    places.forEach(function (place) {
        nameToID[datasetParser.removeAccents(place.name.toLowerCase())] = place.id;
    })

    // Cut the dataset into little arrays by place ID
    var datasByID = {};
    dataset.forEach(function(data) {
        if (!data) return;
        if (!data.place || !nameToID[data.place] || datasByID[nameToID[data.place]] === undefined) {
            datasByID[nameToID[data.place]] = [];
        }
        datasByID[nameToID[data.place]].push(data.date);
    })

    // Sort each array by date
    Object.keys(datasByID).forEach(function (key) {
        datasByID[key].sort(function (data1, data2) {
            return data1.getTime() - data2.getTime();
        })
    })
    //realDatas = datasByID;
})
.catch(function (err) {
    console.log('ERROR :', err)
})

// In dev, there are usually no sensor pushing.
// Let's simulate that part
// if(process.env.NODE_ENV === 'development'){
//     simulateSensorMeasurementArrival();
// }
