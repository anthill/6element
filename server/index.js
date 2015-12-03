"use strict";

require('es6-shim');

var fs = require('fs');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression')

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var jsdom = require('jsdom');

var makeDocument = require('./makeDocument');
var networks = require('./database/models/networks.js');
var places = require('./database/models/places.js');
var search = require('./searchFiles.js');
var stats = require('./statsFiles.js');
var dictionary = require('../data/dictionary.json');
var layoutData = require('../common/layoutData');

var Layout = require('../src/views/layout');
var PRIVATE = require('../PRIVATE.json');

var app = express();

var PORT = process.env.VIRTUAL_PORT ? process.env.VIRTUAL_PORT: 3500;

// Sockets
var server  = require('http').createServer(app);
var io6element = require('socket.io')(server);
io6element.on('connection', function(){ });

var ioPheromon = require('socket.io-client')('https://pheromon.ants.builders');
ioPheromon.connect();

// On 'bin' socket received from Pheromon, we will update the concerned bin status
// + transfer the socket to the client in case of the recycling center being displayed
ioPheromon.on('bin', function(data){
    
    places.updateBin(data.installed_at, data.bin)
    .then(function(){
        io6element.emit('bin', data); 
    })
    .catch(function(err){ console.error('/', err, err.stack); }); 
});


// Doesn't make sense to start the server if this file doesn't exist. *Sync is fine.
var indexHTMLStr = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), {encoding: 'utf8'});

function renderDocumentWithData(doc, data, reactComponent){    
    doc.getElementById('reactHere').innerHTML = ReactDOMServer.renderToString( React.createElement(reactComponent, data) );
    
    var initDataInertElement = doc.querySelector('script#init-data');
    if(initDataInertElement)
        initDataInertElement.textContent = JSON.stringify(data);
}


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());



app.get('/', function(req, res){
    // Create a fresh document every time
    makeDocument(indexHTMLStr).then(function(result){
        var doc = result.document;
        var dispose = result.dispose;

        // Material-ui needs to change the global.navigator.userAgent property
        // (just during the React  rendering)
        // Waiting for Material team to fix it 
        //https://github.com/callemall/material-ui/pull/2007#issuecomment-155414926
        global.navigator = {'userAgent': req.headers['user-agent']};
        renderDocumentWithData(doc, layoutData, Layout);
        global.navigator = undefined;

        res.send( jsdom.serializeDocument(doc) );
        dispose();
    })
    .catch(function(err){ console.error('/', err, err.stack); }); 
});

app.get('/bins/get/:pheromonId', function(req, res){
    if(req.query.s === PRIVATE.secret) {
        var pheromonId = req.params.pheromonId;
        console.log('requesting GET bins for pheromonId', pheromonId);

        places.getBins(pheromonId)
        .then(function(data){
            res.status(200).send(data);
        })
        .catch(function(error){
            res.status(500).send('Couldn\'t get bins from database');
            console.log('error in GET /bins/' + pheromonId, error);
        });
    } else res.status(403).send({success: false, message: 'No token provided.'});
});

app.post('/bins/update', function(req, res){
    if(req.query.s === PRIVATE.secret) {
        var pheromonId = req.body.pheromonId;

        console.log('requesting UPDATE bins for pheromonId', pheromonId);
        
        places.updateBins(pheromonId, req.body.bins)
        .then(function(data){
            res.status(200).send(data);
        })
        .catch(function(error){
            res.status(500).send('Couldn\'t update Bins');
            console.log('error in /bins/update/' + pheromonId, error);
        });
    } else res.status(403).send({success: false, message: 'No token provided.'});
});

app.get('/browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '..', 'src', 'browserify-bundle.js'));
});

app.use("/css/leaflet.css", express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));
app.use("/images-leaflet", express.static(path.join(__dirname, '../node_modules/leaflet/dist/images')));

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


server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});

