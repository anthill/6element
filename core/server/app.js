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
var fs = require('fs');

var database = require('../database');

var PORT = 4000;
var DEBUG = process.env.NODE_ENV === "development" ? true : false;

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

// remove accents from a String
function RemoveAccents(strAccents) {
    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
}

// parse a .csv and return an array of objects
function parseCSVSync(csv, format, callback) {
    var file = csv.toString().split('\n');
    var _format = file.shift().split(';');
    if (format)
        _format = format;
    var objArray = file.map(function (line) {
        if (line.length === 0)
            return null;
        var i = 0;
        var obj = {};
        line.split(';').forEach(function (field) {
            obj[(_format[i]).toString()] = field;
            ++i;
        })
        return obj;
    })
    if (callback && typeof(callback) == "function")
        callback(null, objArray);
    return objArray;
}

// return the whole dataset as an array of objects like this: [{place, date}, {place, date}]
function readDataset() {
    return new Promise(function (resolve, reject) {
        fs.readFile('/6element/data/all_data.csv', function (err, file) {
            if (err) reject(err);

            var dataset = parseCSVSync(file, ['place', 'date', 'who', 'what', 'quantity', 'unit'])
            .map(function (object) {
                if (object)
                    return {place: object.place.replace('ST ', 'Saint-').toLowerCase(), date: new Date(object.date)};
                else
                    return (null);
            });
            resolve(dataset);
        })
    });
}

var PCsv = readDataset()

// return all the places in the DB in order to create a map name->id
var PPlaces = database.complexQueries.getAllPlacesInfos()

var getPlaceMeasurements


Promise.all([PCsv, PPlaces])
.then(function(results) {
    debug('DB and dataset retrieved')
    var dataset = results[0];
    var places = results[1];

    var nameToID = {};

    places.forEach(function (place) {
        nameToID[RemoveAccents(place.name.toLowerCase())] = place.id;
    })

    // Cut the dataset into little arrays by place ID
    var datasByID = {};
    dataset.forEach(function(data) {
        if (!data) return ;
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

    console.log(datasByID)
});

// In dev, there are usually no sensor pushing.
// Let's simulate that part
// if(process.env.NODE_ENV === 'development'){
//     simulateSensorMeasurementArrival();
// }
