"use strict";

var search = require('./searchFiles.js');

var bodyParser	= require('body-parser');
var express 	= require('express');
var path 		= require('path');
var app 		= express();
var server 	= require('http').createServer(app);

var PORT = process.env.VIRTUAL_PORT;
var DEBUG = process.env.NODE_ENV === "development";

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(path.join(__dirname, '../clients/6poc/web')));

app.post('/search', search);


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
