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
        // Initial rendering
		render();
    })
    .catch(errlog);


socket.on('status', function (msg) {

    // GET DATA
    var id = msg.sensorId;
    var status = msg.socketMessage;
    console.log('Hello', status, id);

    var updatingAnt = topLevelStore.ants.get(id);
    updatingAnt.quipu_status = 'sleeping';

    topLevelStore.ants.set(id, updatingAnt);
    // console.log('ant', ant);

    // ANIMATE
    topLevelStore.updatingID = id;
    render();

    setTimeout(function(){
        topLevelStore.updatingID = undefined;
        render();
    }, 200);

});
