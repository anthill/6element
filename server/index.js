"use strict";

require('es6-shim');
require('better-log').install();

var path = require('path');
var express = require('express');
var app = express();
var compression = require('compression');
var errlog = function(str){
    return function(err){
        console.error(str, err.stack);
    }
}
 
var fs = require('fs');

var PORT = 6482;

var database = require('../database');
var dropAllTables = require('../database/management/dropAllTables');
var createTables = require('../database/management/createTables');
var fillDBWithFakeData = require('./fillDBWithFakeData.js');

function rand(n){
    return Math.floor(n*Math.random());
}


dropAllTables()
    .then(createTables)
    .then(fillDBWithFakeData)
    .catch(errlog('drop and create'));


app.use(compression());

app.use("/css/leaflet.css", express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));
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

app.get('/recycling-center/:rcId', function(req, res){
    var rcId = Number(req.params.rcId);
    
    database.complexQueries.getRecyclingCenterDetails(rcId)
        .then(function(data){
            res.send(data);
        })
        .catch(errlog('/recycling-center/'+req.params.rcId));
});


app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});
