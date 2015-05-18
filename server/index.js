"use strict";

var path = require('path');
var express = require('express');
var app = express();
var compression = require('compression');
var errlog = console.error.bind(console);
 
var fs = require('fs');

var PORT = 6482;

app.use(compression());

// Allow CORS headers since it's an API
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});



app.use("/css/leaflet.css", express.static(__dirname + '/node_modules/leaflet/dist/leaflet.css'));
app.use("/css", express.static(__dirname + '/viz/css'));
app.use("/images", express.static(__dirname + '/viz/images'));

app.get('/', function(req, res){
    if(req.query.s === secret)
        res.sendFile(path.join(__dirname, 'viz/index.html'));
    else
        res.status(404).send(path.join(__dirname, '404'))
});
app.get('/app.js', function(req, res){
    res.sendFile(path.join(__dirname, 'viz/app.js'));
});


app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});
