"use strict";

require('es6-shim');
require('better-log').install();

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
app.get('/browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../client/browserify-bundle.js'));
});


var BORDEAUX_COORDS = [44.84, -0.57];
var BM_CITIES = ["Bordeaux","Ambarès-et-Lagrave","Ambès","Artigues-près-Bordeaux","Bassens","Bègles","Blanquefort","Bouliac","Bruges","Carbon-Blanc","Cenon","Eysines","Floirac","Gradignan","Le Bouscat","Le Haillan","Le Taillan-Médoc","Lormont","Martignas-sur-Jalle","Mérignac","Parempuyre","Pessac","Saint-Aubin-de-Médoc","Saint-Louis-de-Montferrand","Saint-Médard-en-Jalles","Saint-Vincent-de-Paul","Talence","Villenave-d'Ornon"];

function rand(max, min){
    min = min !== undefined ? min : 0;
    max = max !== undefined ? max : 100;
    
    return Math.round(min + (max - min)*Math.random());
}

var DIST = 0.1;
var recyclingCenters = Array(10).fill().map(function(e, i){
    var max = 50 + rand(50);

    return {
        lat: BORDEAUX_COORDS[0] + 2*DIST*Math.random() - DIST,
        lon: BORDEAUX_COORDS[1] + 2*DIST*Math.random() - DIST,
        max: max,
        current: rand(max),
        name: BM_CITIES[rand(BM_CITIES.length)],
        id: i
    }
});

app.get('/live-affluence', function(req, res){
    res.send(recyclingCenters);
});


app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});
