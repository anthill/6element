var search = require('./search.js');

var bodyParser	= require('body-parser');
var express 	= require('express');
var app 		= express();
var server 	= require('http').createServer(app);

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(__dirname + '/..' + '/web'));

app.post('/search', search);

server.listen(33000);
console.log('Server started on', 33000);
