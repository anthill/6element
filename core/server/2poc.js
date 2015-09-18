"use strict";

require('es6-shim');
require('better-log').install();

var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var compression = require('compression');
var bodyParser = require('body-parser');

var fs = require('fs');
var database = require('../database');

var PORT = process.env.VIRTUAL_PORT;
var DEBUG = process.env.NODE_ENV === "development";
var secret = require("../PRIVATE.json").secret;

var debug = function() {
    if (DEBUG) {
        [].unshift.call(arguments, "[DEBUG 6element] ");
        console.log.apply(console, arguments);
    }
}

// Admin API
app.use(compression());
app.use(bodyParser.json());



app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/Citizen/index.html'));
});


app.get('/Citizen-browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../clients/Citizen-browserify-bundle.js'));
});

app.use("/css", express.static(path.join(__dirname, '../clients/Citizen/css')));
app.use("/pictures", express.static(path.join(__dirname, '../clients/Citizen/pictures')));



app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});


process.on('uncaughtException', function(e){
    console.error('uncaught', e, e.stack);
    process.kill();
});
