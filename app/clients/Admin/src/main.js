'use strict';

var React = require('react');
var io = require('socket.io-client');

var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/js/makeMap.js');
var resetUpdate = require('../../_common/js/resetUpdate.js');
var serverAPI = require('../../_common/js/serverAPI.js');

var socket = io();

var errlog = console.error.bind(console);

function render(){
    React.render(new Application(topLevelStore), document.body);
}


function updatePlaceDb(datas) {

    if (typeof(datas) === 'object')
        datas = [datas];

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
        return serverAPI.updateRC(obj);
    });

    Promise.all(queryP)
        .then(function (results) {
            // console.log("results", results);
            console.log('Places database updated successfully (updatePlaceDb)');
            results.map(function (result) {
                refreshView();
            });
        })
        .catch(function(err){
                console.log('Places database didn\'t update correctly (updatePlaceDb)', err);
                refreshView();
            });
}



function updateSensorDb(datas) {

    var objs = datas.map(function (data){
        var delta = {};
        delta[data.field] = data.value;

        var obj = {
            id: data.id,
            delta: delta
        };
        return obj;
    });

    console.log('objs dans updateSensorDb', objs);

    var queryP = objs.map(function (obj) {
        return serverAPI.updateSensor(obj);
    });
    // console.log("queryP", queryP);
    Promise.all(queryP)
        .then(function (results) {
            // console.log("results", results);
            console.log('Places database updated successfully (updateSensorDb)');
            refreshView();
        })
        .catch(function(err){
            console.log('Places database didn\'t update correctly (updateSensorDb)', err);
            refreshView();
        });
}


function updateLocalPlace(place){
    topLevelStore.placeMap.set(place.id, place);

    render();
}

function updateLocalSensor(sensor){
    topLevelStore.sensorMap.set(sensor.id, sensor);

    render();
}

function refreshView(){

    var placesP = serverAPI.getAllPlacesInfos();
    var sensorsP = serverAPI.getAllSensors();

    Promise.all([placesP, sensorsP])
    .then(function(results){

        //console.log('places', results[0]);
        // console.log('sensors', results[1]);

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

var topLevelStore = {
    sensorMap: undefined,
    placeMap: undefined,
    // onChange: updateDB,
    onChangePlace: updatePlaceDb,
    onChangeSensor: updateSensorDb
};

// Initial rendering
refreshView();

// THIS WILL BE NEEDED WHEN QUIPU SIGNAL IS INCORPORATED INTO DATA MSGS
// socket.on('data', function (msg){
//     var id = msg.socketMessage.sensor_id;
//     var signal = msg.socketMessage.quipu.signal;

//     var updatingAnt = topLevelStore.ants.get(id);
//     updatingAnt.signal = signal;

//     render();
// });

socket.on('status', function (msg) {

    // GET DATA
    var id = msg.sensorId;
    var status = msg.socketMessage;

    resetUpdate(topLevelStore.sensorMap);

    var updatingSensorMap = topLevelStore.sensorMap.get(id);
    updatingSensorMap.quipu_status = status.quipu.state;
    updatingSensorMap.signal = status.quipu.signal;
    updatingSensorMap.sense_status = status.sense;
    updatingSensorMap.latest_input = status.info.command;
    updatingSensorMap.latest_output = status.info.result;
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

