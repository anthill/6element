"use strict";

var path = require('path');
var express = require('express');
var app = express();
var compression = require('compression');
var errlog = console.error.bind(console);
 
var fs = require('fs');

var PORT = 6482;

app.use(compression());

app.use("/css/leaflet.css", express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));
app.use("/css", express.static(path.join(__dirname, '../client/css')));
app.use("/images", express.static(path.join(__dirname, '../client/images')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.get('/app.js', function(req, res){
    res.sendFile(path.join(__dirname, '../client/app.js'));
});


app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});
