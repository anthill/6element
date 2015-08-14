'use strict';

var React = require('react');
var io = require('socket.io-client');

var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/js/makeMap.js');
var resetUpdate = require('../../_common/js/resetUpdate.js');
var serverAPI = require('./serverAPI.js');

var socket = io();

var errlog = console.error.bind(console);

function render(){
    React.render(new Application(topLevelStore), document.body);
}


function updatePlaceInDb(datas) {

    console.log('PLACE datas', datas);

    var objs = datas.map(function (data){
        var delta = {};
        delta[data.field] = data.value;

        var obj = {
            id: data.id,
            delta: delta
        };
        return obj;
    });

    var queryP = objs.map(function (obj) {
        return serverAPI.updatePlace(obj);
    });

    Promise.all(queryP)
    .then(function() {
        console.log('Places database updated successfully (updatePlaceDb)');
        refreshView();
    })
    .catch(function(err){
        console.log('Places database didn\'t update correctly (updatePlaceDb)', err);
        refreshView();
    });
}



function updateSensorInDb(datas) {

    console.log('SENSOR datas', datas);

    var objs = datas.map(function (data){
        var delta = {};
        delta[data.field] = data.value;

        var obj = {
            id: data.id,
            delta: delta
        };
        return obj;
    });

    var queryPs = objs.map(function (obj) {
        return serverAPI.updateSensor(obj);
    });
    // console.log("queryP", queryP);
    return Promise.all(queryPs)
    .then(function() {
        // console.log("results", results);
        console.log('Places database updated successfully (updateSensorDb)');
        refreshView();
    })
    .catch(function(err){
        console.log('Places database didn\'t update correctly (updateSensorDb)', err);
        refreshView();
    });
}

function createPlaceInDb(data) {

    console.log('createPLACE data', data);

    serverAPI.createPlace(data)
    .then(function() {
        console.log('Places database created successfully (createPlaceDb)');
        refreshView();
    })
    .catch(function(err){
        console.log('Places database didn\'t create correctly (createPlaceDb)', err);
        refreshView();
    });
}

function removePlaceFromDb(data) {

    // Queries to uninstall ants from place
    var queryP = updateSensorInDb(data.ants);

    queryP
    .then(function() {
        console.log("Ants uninstall successfull");
        return serverAPI.removePlace({
            id: data.placeId
        });
    })
    .then(function() {
        console.log('Place removed successfully');
        refreshView();
    })
    .catch(function(err){
        console.log('Place didn\'t remove correctly', err);
        refreshView();
    });
}

function removeSensorFromDb(data) {

    console.log('deleteSensor data', data);

    serverAPI.removeSensor({
        id: data.sensorId
    })
    .then(function() {
        console.log('Sensor removed successfully');
        refreshView();
    })
    .catch(function(err){
        console.log('Sensor didn\'t remove correctly', err);
        refreshView();
    });
}

function createSensorInDb(data) {

    console.log('createSensor data', data);

    serverAPI.createSensor(data)
    .then(function() {
        console.log('Sensor database created successfully (createSensorDb)');
        refreshView();
    })
    .catch(function(err){
        console.log('Sensor database didn\'t create correctly (createSensorDb)', err);
        refreshView();
    });
}

function refreshView(){

    var placesP = serverAPI.getAllPlacesInfos();
    var sensorsP = serverAPI.getAllSensors();

    Promise.all([placesP, sensorsP])
    .then(function(results){

        results[0].sort(function(a, b){
            return a.name > b.name ? 1 : -1;
        });

        results[1].sort(function(a, b){
            return a.id > b.id ? 1 : -1;
        });

        console.log('places', results[0]);
        console.log('sensors', results[1]);

        topLevelStore.placeMap = makeMap(results[0], 'id');
        topLevelStore.sensorMap = makeMap(results[1], 'id');

        topLevelStore.placeMap.forEach(function (place){
            if (place.sensor_ids[0] !== null)
                place.sensor_ids = new Set(place.sensor_ids);
            else
                place.sensor_ids = new Set()
        });

        resetUpdate(topLevelStore.sensorMap);
        // console.log('topLevelStore', topLevelStore.placeMap);
        render();
    })
    .catch(errlog);
}

function sendCommand(command, selectedAntSet){
    var antNames = [];
    selectedAntSet.forEach(function(id){
        antNames.push(topLevelStore.sensorMap.get(id).name);
    });

    console.log('Sending command', command, ' to ', antNames.join(' '));
}



var topLevelStore = {
    sensorMap: undefined,
    placeMap: undefined,
    onChangePlace: updatePlaceInDb,
    onChangeSensor: updateSensorInDb,
    onCreatePlace: createPlaceInDb,
    onRemovePlace: removePlaceFromDb,
    onRemoveSensor: removeSensorFromDb,
    onCreateSensor: createSensorInDb,
    sendCommand: sendCommand
};

// Initial rendering
refreshView();

// THIS WILL BE NEEDED WHEN QUIPU SIGNAL IS INCORPORATED INTO DATA MSGS
socket.on('data', function (msg){
    var id = msg.socketMessage.sensor_id;
    var signal = msg.socketMessage.quipu.signal;

    var updatingAnt = topLevelStore.ants.get(id);
    updatingAnt.signal = signal;

    render();
});

socket.on('status', function (msg) {

    // GET DATA
    var id = msg.sensorId;
    var status = msg.socketMessage;

    resetUpdate(topLevelStore.sensorMap);

    var updatingSensorMap = topLevelStore.sensorMap.get(id);
    updatingSensorMap.quipu_status = status.quipu.state;
    updatingSensorMap.signal = status.quipu.signal;
    updatingSensorMap.sense_status = status.sense;
    if (status.info){
        updatingSensorMap.latest_input = status.info.command;
        updatingSensorMap.latest_output = status.info.result;
    }
    
    updatingSensorMap.isUpdating = true;
    
    // console.log('sensors', updatingSensors);

    render();

    setTimeout(function(){
        resetUpdate(topLevelStore.sensorMap);
        render();
    }, 200);

});



// // USE TO SIMULATE A STATUS SENDING TO SERVER FROM SENSOR

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

