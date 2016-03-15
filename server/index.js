"use strict";

require('es6-shim');

var fs = require('fs');
var path = require('path');

var PRIVATE = require('../PRIVATE.json');

// Express
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression')

// Server side rendering
var jsdom       = require('jsdom');
var react       = require('react');
var reactServer = require('react-dom/server');
var parseHtml   = require('./parseHtml');
var placesView  = require('../client/views/placesView.js');

// Route
var search = require('./searchPlaces.js');

// Database
var places = require('./database/models/places.js');

// Pheromon API calls
var pheromonUrl = process.env.PHEROMON_URL ? process.env.PHEROMON_URL : 'https://pheromon.ants.builders';
var getMeasures     = require('./getMeasures');

// ------- INIT SERVER ---------
var PORT = process.env.VIRTUAL_PORT ? process.env.VIRTUAL_PORT: 8000;
var app = express();
var server  = require('http').createServer(app);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());


// ---------- SOCKETS ----------
// Frontside sockets to activate
//var io6element = require('socket.io')(server);
//io6element.on('connection', function(){ });

// On 'bin' socket received from Pheromon, we will update the concerned bin status
// + transfer the socket to the client in case of the recycling center being displayed
var ioPheromon = require('socket.io-client')('https://pheromon.ants.builders');
ioPheromon.connect();
ioPheromon.on('bin', function(data){
    
    places.updateBin(data.installed_at, data.bin)
    .then(function(){
        //console.log('emit socket');
        //io6element.emit('bin', data); 
    })
    .catch(function(err){ console.error('/', err, err.stack); }); 
});


// ---------- SERVER RENDERING ----------
// Doesn't make sense to start the server if these files don't exist. 
var decheteriesHtml = fs.readFileSync(path.join(__dirname, '..', 'client', 'decheteries.html'), {encoding: 'utf8'});
var indexHtml       = fs.readFileSync(path.join(__dirname, '..', 'client', 'index.html'), {encoding: 'utf8'});

// Redirecting previous url
app.get('/operator/:name', function(req,res){
    if (req.params.name){
        var now = new Date();
        var strDate = now.getDate().toString()+'-'+(now.getMonth()+1).toString()+'-'+now.getFullYear().toString();
        res.redirect("/decheteries.html?operateur="+req.params.name+"&date="+strDate);
    }
    else{
        redirectError(res, "La page que vous recherchez n'existe pas");
    }
});

// Main routing path
app.get('/decheteries.html', function(req,res){
    
    var selection = {
        date: new Date(),
        mode: 'citizen',
        places: undefined
    }
   
    // Default date = today
    if(req.query.date !== undefined){
        
        var strDate = req.query.date.split('-');
        selection.date = new Date(strDate[2],strDate[1]-1, strDate[0]);
    }
    
    var getPlaces = undefined;// Find the good method

    // 'A proximité' or search activated
    if(req.query.position !== undefined){
        
        var position = JSON.parse(req.query.position);
        getPlaces = places.getKNearest({ lat: position[0], lon: position[1] }, 20);
    }
    // 'Mes déchèteries' activated
    else if(req.query.places !== undefined){
        
        var ids = JSON.parse(req.query.places);
        getPlaces = places.getByIds(ids);
    }
    // Operateur path
    else if(req.query.operateur !== undefined){
        
        selection.mode = 'operator';
        var operator = req.query.operateur;
        getPlaces = places.getByOperator(operator);
    }

    if(getPlaces === undefined) 
        return redirectError(res, "Erreur de traitement, veuillez renouveler votre recherche");
  
    // DB places
    getPlaces
    .then(function(placesFromDB){

        selection.places = placesFromDB;
        
        // + measures
        getMeasures(pheromonUrl, selection)
        .then(function(placesWithMeasures){

            selection.places = placesWithMeasures;
            
            // 1. parse the html template
            parseHtml(decheteriesHtml).
            then(function(result){
                // 2. insert the react component rendered
                result.document.getElementById('sheet').innerHTML = reactServer.renderToString( react.createElement(placesView, selection) );
                // 3. send Html 
                res.send( jsdom.serializeDocument(result.document) );
                // 4. Free memory
                result.dispose();
            })
            .catch(function(err){ 
                console.error('/', err, err.stack); 
                redirectError(res, "Erreur de traitement, veuillez renouveler votre recherche");
            }); 
        })
        .catch(function(err){
            console.error('/', err, err.stack); 
            redirectError(res, "Erreur de traitement, veuillez renouveler votre recherche");
        });
    })
    .catch(function(err){
        console.error('/', err, err.stack); 
        redirectError(res, "Erreur de traitement, veuillez renouveler votre recherche");
    });
});



// ---------- API ----------

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


app.post('/search', search);
app.get('/networks', function(req, res){
    res.setHeader('Content-Type', 'application/json')
    fs.createReadStream(path.join(__dirname, '..', 'data', 'networks.json')).pipe(res);
});


app.use(express.static(path.join(__dirname, '..', 'client'), {etag: false, maxAge: 60*60*1000}));

// ---------- CATCH ERRORS ----------

function redirectError(res, error){
    // 1. parse the html template
    parseHtml(indexHtml).
    then(function(result){
        // 2. insert the react component rendered
        result.document.getElementById('errorposition').innerHTML = error;
        // 3. send Html 
        res.send( jsdom.serializeDocument(result.document) );
        // 4. Free memory
        result.dispose();
    })
    .catch(function(err){ 
        console.error('/', err, err.stack); 
        res.status(500).send(err);
    }); 
}

// catchall
app.use(function(req, res){
    redirectError(res, "La page que vous recherchez n'existe pas");
});


// -------- SERVER LISTENING --------

server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});


