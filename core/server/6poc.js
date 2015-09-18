"use strict";

var search = require('./searchFiles.js');

var bodyParser	= require('body-parser');
var express 	= require('express');
var path 		= require('path');
var app 		= express();
var server 	= require('http').createServer(app);

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(path.join(__dirname, '../clients/6poc/web')));

app.post('/search', search);

server.listen(33000);
console.log('Server started on', 33000);
