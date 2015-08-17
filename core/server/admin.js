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
var spawn = require('child_process').spawn;
var tcpSocketEndpoint;

var fs = require('fs');
var database = require('../database');
var schedule = require('node-schedule');
var zlib = require('zlib');

var PORT = 4001;
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

io.on('connection', function(socket) {
    socket.on('cmd', function(cmd) {
        console.log('admin client data received');
        if (tcpSocketEndpoint) {
            tcpSocketEndpoint.write(JSON.stringify(cmd) + "\n");
        }
    })
})

// listening to the reception server

var endpointInterval = setInterval(function() {
    tcpSocketEndpoint = net.connect(endpointConfig, function(){

        debug('connected to the reception server on '+ tcpSocketEndpoint.remoteAddress+':'+tcpSocketEndpoint.remotePort)
        
        var tcpSocketEndpointReceiver = makeTcpReceiver(tcpSocketEndpoint, "\n");

        tcpSocketEndpointReceiver.on('message', function(message) {
            var packet = JSON.parse(message);

            if (packet.type === 'status') {
                io.sockets.emit('status', packet.data);
            }
        })
            
    });

    tcpSocketEndpoint.on('error', function(err) {
        console.log('[ERROR]: INTERNAL SOCKET : ' + err.message);
    });

    tcpSocketEndpoint.on('connect', function() {
        console.log('connection')
        clearInterval(endpointInterval);
    });
}, 5000);


// Backup database everyday at 3AM
schedule.scheduleJob('0 3 * * *', function(){
    console.log("Backup database");
    var gzip = zlib.createGzip();
    var today = new Date();
    var wstream = fs.createWriteStream('/6element/app/data/backups/' + today.getDay() + '.txt.gz');
    var proc = spawn('pg_dump', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-d', process.env.POSTGRES_USER, '-w']);
    proc.stdout
        .pipe(gzip)
        .pipe(wstream);
    proc.stderr.on('data', function(buffer) {
        console.log(buffer.toString().replace('\n', ''));
    })
});

// Admin API
app.use(compression());
app.use(bodyParser.json());

app.use("/leaflet.css", express.static(path.join(__dirname, '../../node_modules/leaflet/dist/leaflet.css')));
app.use("/Admin", express.static(path.join(__dirname, '../clients/Admin')));
app.use("/_common", express.static(path.join(__dirname, '../clients/_common')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/Admin/index.html'));
});


app.get('/Admin-browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/Admin-browserify-bundle.js'));
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
    
    database.complexQueries.getPlaceDetails(id)
    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        console.log("error in /place/'+req.params.id: ", error);
    });
});

app.get('/allPlacesInfos', function(req, res){
    database.complexQueries.getAllPlacesInfos()
    .then(function(data){
        // debug('All places infos', data);
        res.send(data);
    })
    .catch(function(error){
        console.log("error in /allPlacesInfos: ", error);
    });
});

app.get('/allSensors', function(req, res){
    database.Sensors.getAllSensors()
    .then(function(data){
        // debug('All sensors', data);
        res.send(data);
    })
    .catch(function(error){
        console.log("error in /sensors: ", error);
    });
});

app.post('/updatePlace', function(req, res){
    var id = Number(req.body.id);

    database.Places.update(id, req.body.delta)
    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        res.status(500).send('Couldn\'t update Places database');
        console.log("error in /updatePlace/'+req.params.id: ", error);
    });
});

app.post('/updateSensor', function(req, res){
    var id = Number(req.body.id);

    database.Sensors.update(id, req.body.delta) // req.body.delta : {name,lat,lon}
    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        res.status(500).send('Couldn\'t update Sensors database');
        console.log("error in /updateSensors/'+req.params.id: ", error);
    });
});

app.post('/createPlace', function(req, res){    
    console.log('creating place', req.body);

    database.Places.create(req.body)
    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        res.status(500).send('Couldn\'t create Place in database');
        console.log("error in /createPlace/'+req.params.id: ", error);
    });
});

app.post('/removePlace', function(req, res){    
    console.log('remove place', req.body.id);

    database.Places.delete(req.body.id)
    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        res.status(500).send('Couldn\'t delete Place from database');
        console.log("error in /deletePlace/'+req.params.id: ", error);
    });
});

app.post('/removeSensor', function(req, res){    
    console.log('remove sensor', req.body.id);

    database.Sensors.delete(req.body.id)

    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        res.status(500).send('Couldn\'t delete Sensor from database');
        console.log("error in /deleteSensor/'+req.params.id: ", error);
    });
});

app.post('/createSensor', function(req, res){    
    console.log('creating sensor', req.body);

    database.Sensors.create(req.body)
    .then(function(data){
        res.send(data);
    })
    .catch(function(error){
        res.status(500).send('Couldn\'t create Sensor in database');
        console.log("error in /createSensor/'+req.params.id: ", error);
    });
});

server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});


process.on('uncaughtException', function(e){
    console.error('uncaught', e, e.stack);
    process.kill();
});
