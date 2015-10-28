"use strict";

require('es6-shim');

var path 		= require('path');
var bodyParser	= require('body-parser');
var express 	= require('express');
var app 		= express();
var server 	= require('http').createServer(app);

var networks = require('./database/models/networks.js');
var search = require('./searchFiles.js');
var dictionnary = require('../data/dictionnary.json');

var PORT = process.env.VIRTUAL_PORT ? process.env.VIRTUAL_PORT: 3500;
var DEBUG = process.env.NODE_ENV === "development";

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(path.join(__dirname, '../src')));
app.use("/css/leaflet.css", 	express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));
app.use("/images-leaflet", 	express.static(path.join(__dirname, '../node_modules/leaflet/dist/images')));
app.use("/css/material/", 	express.static(path.join(__dirname, '../node_modules/material-design-lite')));

app.get('/Citizen-browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../Citizen-browserify-bundle.js'));
});

app.post('/search', search);
app.get('/networks', function(req, res){
	networks.getAll()
	.then(function(data){
	    res.setHeader('Content-Type', 'application/json');
	    res.send(JSON.stringify(data));
	})
	.catch(function(err){
		console.log('/networks error', err);
		res.status(500).send(err);
	});
});

app.get('/categories', function(req, res){
	res.send(JSON.stringify(dictionnary));
});


app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});

