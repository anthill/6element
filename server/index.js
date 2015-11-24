"use strict";

require('es6-shim');

var fs = require('fs');
var path = require('path');

var bodyParser = require('body-parser');
var express = require('express');
var React = require('react');
var jsdom = require('jsdom');

var makeDocument = require('./makeDocument');
var networks = require('./database/models/networks.js');
var search = require('./searchFiles.js');
var stats = require('./statsFiles.js');
var dictionary = require('../data/dictionary.json');
var layoutData = require('../common/layoutData');

var Layout = require('../src/views/layout');

var app = express();
var PORT = process.env.VIRTUAL_PORT ? process.env.VIRTUAL_PORT: 3500;
// var DEBUG = process.env.NODE_ENV === "development";


// Doesn't make sense to start the server if this file doesn't exist. *Sync is fine.
var indexHTMLStr = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), {encoding: 'utf8'});

function renderDocumentWithData(doc, data, reactComponent){    
    doc.querySelector('body').innerHTML = React.renderToString( React.createElement(reactComponent, data) );
    
    var initDataInertElement = doc.querySelector('script#init-data');
    if(initDataInertElement)
        initDataInertElement.textContent = JSON.stringify(data);
}


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}))



app.get('/', function(req, res){
    // Create a fresh document every time
    makeDocument(indexHTMLStr).then(function(result){
        var doc = result.document;
        var dispose = result.dispose;

        renderDocumentWithData(doc, layoutData, Layout);
        res.send( jsdom.serializeDocument(doc) );
        dispose();
    })
    .catch(function(err){ console.error('/', err, err.stack); });
    
});

app.get('/Citizen-browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../Citizen-browserify-bundle.js'));
});

app.use("/css/leaflet.css", express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));
app.use("/images-leaflet", express.static(path.join(__dirname, '../node_modules/leaflet/dist/images')));
app.use("/css/material/", express.static(path.join(__dirname, '../node_modules/material-design-lite')));



app.post('/search', search);
app.post('/stats', stats);
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

var categoriesStr = JSON.stringify(dictionary);
app.get('/categories', function(req, res){
    res.setHeader('Content-Type', 'application/json');
	res.send(categoriesStr);
});

app.use('/', express.static(path.join(__dirname, '../src')));


app.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});

