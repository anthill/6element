'use strict';

var React = require('react');
var io = require('socket.io-client');

var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/js/makeMap.js');
var resetUpdate = require('../../_common/js/resetUpdate.js');
var serverAPI = require('../../_common/js/serverAPI.js');

var socket = io();

var errlog = console.error.bind(console);

var topLevelStore = {
	ants: undefined
};

function render(){
    React.render(new Application(topLevelStore), document.body);
}

serverAPI.getAllSensors()
    .then(function(sensors){
        topLevelStore.ants = makeMap(sensors, 'id');
        resetUpdate(topLevelStore.ants);

        console.log('topLevelStore', topLevelStore.ants);
        // Initial rendering
		render();
    })
    .catch(errlog);

socket.on('status', function (msg) {

    // GET DATA
    var id = msg.sensorId;
    var status = msg.socketMessage;

    resetUpdate(topLevelStore.ants);

    var updatingAnt = topLevelStore.ants.get(id);
    updatingAnt.quipu_status = status.quipu;
    updatingAnt.sense_status = status.sense;
    updatingAnt.latest_input = status.info.command;
    updatingAnt.latest_output = status.info.result;
    updatingAnt.isUpdating = true;
    
    console.log('ant', updatingAnt);

    render();

    setTimeout(function(){
        resetUpdate(topLevelStore.ants);
        render();
    }, 200);

});



// var quipu = require('quipu/parser.js');
// var sendReq = require('../../_common/js/sendReq.js');

// setInterval(function(){

// 	var id = Math.floor(Math.random() * 28);

// 	quipu.encode({
// 		info: {
// 			command: 'connect3G',
// 			result: 'OK'
// 		},
// 		quipu: '3G_connected',
// 		sense: 'recording'
// 	})
// 	.then(function(msg){
// 		var toSend = {
// 			From: 'xxx' + id,
// 			Body: '2' + msg
// 		};

// 		console.log('Sending', toSend);
// 		sendReq('POST', '/twilio', toSend);
// 	})
// 	.catch(function(err){
// 		console.log(err);
// 	});

// }, 3000);

