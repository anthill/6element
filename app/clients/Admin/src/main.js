'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/js/makeMap.js');
var serverAPI = require('../../_common/js/serverAPI.js');
var io = require('socket.io-client');

var errlog = console.error.bind(console);

var fakeAnts = require('./fakeAnts.js');

var socket = io();

var topLevelStore = {
	ants: undefined,
	updatingID: undefined
};

function render(){
    React.render(new Application(topLevelStore), document.body);
}


serverAPI.getAllSensors()
    .then(function(sensors){
        console.log('sensors', makeMap(sensors, 'id'));
        topLevelStore.ants = makeMap(sensors, 'id');

        console.log('topLevelStore', topLevelStore.ants);
        // Initial rendering
		render();

		socket.on('status', function (msg) {

		    // GET DATA
		    var id = msg.sensorId;
		    var status = msg.socketMessage;
		    console.log('Hello', status, id);

		    var updatingAnt = topLevelStore.ants.get(id);
		    updatingAnt.quipu_status = status;
		    
		    topLevelStore.ants.set(id, updatingAnt);
		    console.log('ant', updatingAnt);

		    // ANIMATE
		    topLevelStore.updatingID = id;
		    render();

		    setTimeout(function(){
		        topLevelStore.updatingID = undefined;
		        render();
		    }, 200);

		});
    })
    .catch(errlog);

var quipu = require('quipu/parser.js');
var sendReq = require('../../_common/js/sendReq.js');

setTimeout(function(){

	quipu.encode({quipu_status: 'initialized'})
	.then(function(msg){
		var toSend = {
			From: 'xxx1',
			Body: '2' + msg
		};

		console.log('Sending', toSend);
		sendReq('POST', '/twilio', toSend);
	})
	.catch(function(err){
		console.log(err);
	});

}, 5000);

