"use strict";

require('es6-shim');

var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn;
var zlib = require('zlib');
var schedule = require('node-schedule');

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
// var mapScreen =  require('../src/views/mapScreen');
// var placeScreen =  require('../src/views/placeScreen');
var operatorScreen =  require('../src/views/operatorScreen');

var toGeoJson = require('./toGeoJson.js');
var withPlacesMeasurements = require('./withPlacesMeasurements.js');
var PRIVATE = require('../PRIVATE.json');

var app = express();

var PORT = process.env.VIRTUAL_PORT ? process.env.VIRTUAL_PORT: 3500;

// Backup database everyday at 3AM
if (process.env.NODE_ENV === "production") {
    schedule.scheduleJob('0 3 * * *', function(){
        console.log('Backup database');
        var gzip = zlib.createGzip();
        var today = new Date();
        var wstream = fs.createWriteStream('/backups/' + today.getDay() + '.sql.gz');
        var proc = spawn('pg_dump', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-w']);
        proc.stdout
            .pipe(gzip)
            .pipe(wstream);
        proc.stderr.on('data', function(buffer) {
            console.log(buffer.toString().replace('\n', ''));
        });
    });
}

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
        console.log('emit socket');
        io6element.emit('bin', data); 
    })
    .catch(function(err){ console.error('/', err, err.stack); }); 
});


// Doesn't make sense to start the server if this file doesn't exist. *Sync is fine.
var indexHTMLStr = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), {encoding: 'utf8'});

function renderDocumentWithData(doc, data, reactComponent){   
    console.log('server side rendering'); 
    doc.getElementById('reactHere').innerHTML = ReactDOMServer.renderToString( React.createElement(reactComponent, data) );
    
    var initDataInertElement = doc.querySelector('script#init-data');
    if(initDataInertElement)
        initDataInertElement.textContent = JSON.stringify(data);
}

function renderAndSend (req, res, props, view) {
        makeDocument(indexHTMLStr).then(function(result){
            var doc = result.document;
            var dispose = result.dispose;

            // Material-ui needs to change the global.navigator.userAgent property
            // (just during the React  rendering)
            // Waiting for Material team to fix it 
            //https://github.com/callemall/material-ui/pull/2007#issuecomment-155414926
            global.navigator = {'userAgent': req.headers['user-agent']};
            renderDocumentWithData(doc, props, view);
            //global.navigator = undefined;

            res.send( jsdom.serializeDocument(doc) );
            dispose();
        })
        .catch(function(err){ console.error('/', err, err.stack); }); 
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());


var getOperator = function(req, res, mode){

    layoutData['mode'] = mode === 'operator' ? 'operator' : 'citizen';

    var name = "all";
    if (req.params.name)
        name = req.params.name;


    var dataP = places.getPlacesByOperator(name);

    if(req.headers.accept.includes('application/json')){
        console.log('==== calling /operator/ for JSON');

        dataP
        .then(function(data){
            res.send(data);
        })
        .catch(function(error){
            res.status(500).send('Couldn\'t get place of operator from database');
            console.log('error in GET /operator/' + name, error);
        });
    }
    else{
        console.log('==== calling /operator/ for HTML');

        dataP
        .then(function(data){
            toGeoJson(data)
                .then(function(geoJson){
                
                    var list = geoJson.map(function(place){
                        return {'index': 0, 'pheromon_id': place.properties.pheromon_id};
                    })
                    withPlacesMeasurements(list)
                    .then(function(measures){

                        var placesData = geoJson.map(function(place, index){
                            var measure = measures[index];
                            if(measure)
                                place["measurements"] = {latest: measure.latest, max: measure.max};
                            else
                                place["measurements"] = undefined;
                            return place;
                        });                          

                        layoutData.places = placesData;
                        renderAndSend(req, res, layoutData, operatorScreen);
                    })
                    .catch(function(error){
                        res.status(500).send('Couldn\'t get latest measurements');
                        console.log('error in GET /operator/' + name, error);
                    });
                })
                .catch(function(error){
                    res.status(500).send('Couldn\'t convert to geojson');
                    console.log('error in GET /operator/' + name, error);
                });
        })
        .catch(function(error){
            res.status(500).send('Couldn\'t get place of operator from database');
            console.log('error in GET /operator/' + name, error);
        });
    }

}

app.get('/', getOperator);
app.get('/operator/:name', function(req,res){
    getOperator(req,res,'operator')
});
app.get('/operateur/:name', function(req,res){
    getOperator(req,res,'operator')
});
   

// app.get('/place/:placeId/', function(req, res){
//     var placeId = Number(req.params.placeId);

//     if(req.headers.accept.includes('application/json'))
//         console.log('==== calling /place/ for JSON');
//     else
//         console.log('==== calling /place/ for HTML');

//     places.getPlaceById(placeId)
//     .then(function(data){
//         toGeoJson(data)
//         .then(function(geoJson){

//             var place = geoJson[0];

//             if (place.properties.pheromon_id){

                
//                 var list = [{'index': 0, 'pheromon_id': place.properties.pheromon_id}]
//                 withPlacesMeasurements(list)
//                 .then(function(measures){

//                     if(measures !== null && measures.length > 0){
//                         var measure = measures[0];
//                         if(measure)
//                             place["measurements"] = {latest: measure.latest, max: measure.max};
//                         else
//                             place["measurements"] = undefined;
//                     }
//                     if(req.headers.accept.includes('application/json')){
//                         res.setHeader('Content-Type', 'application/json');
//                         res.send(JSON.stringify(place));
//                     } else {
//                         layoutData.detailedObject = place;
//                         renderAndSend(req, res, layoutData, placeScreen);
//                     }
//                 })
//                 .catch(function(err){
//                     console.error(err);
//                     if(req.headers.accept.includes('application/json')){
//                         res.setHeader('Content-Type', 'application/json');
//                         res.send(JSON.stringify(place));
//                     } else {
//                         layoutData.detailedObject = place;
//                         renderAndSend(req, res, layoutData, placeScreen);
//                     }
//                 });
//             }
//             else {
//                 if(req.headers.accept.includes('application/json')){
//                     res.setHeader('Content-Type', 'application/json');
//                     res.send(JSON.stringify(place));
//                 } else {
//                     layoutData.detailedObject = place;
//                     renderAndSend(req, res, layoutData, placeScreen);
//                 }
//             }
//         })
//         .catch(function(error){
//             res.status(500).send('Couldn\'t get place from database');
//             console.log('error in GET /place/' + placeId, error);
//         });
//     })
//     .catch(function(error){
//         res.status(500).send('Couldn\'t get place and measurements from database');
//         console.log('error in GET /place/' + placeId, error);
//     });
// });


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

app.get('/bundle/browserify-bundle.js', function(req, res){
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

