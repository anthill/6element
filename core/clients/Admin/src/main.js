'use strict';

var React = require('react');
var io = require('socket.io-client');

var Application = React.createFactory(require('./Components/Application.js'));
var makeMap = require('../../_common/js/makeMap.js');
var resetUpdate = require('../../_common/js/resetUpdate.js');
var serverAPI = require('./serverAPI.js');

var dbStatusMap = require('./dbStatusMap.js');

var socket = io();

var errlog = console.error.bind(console);

var HOUR = 1000 * 60 * 60;

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

var updatingID;

function refreshView(){

    var placesP = serverAPI.getAllPlacesInfos();
    var sensorsP = serverAPI.getAllSensors();

    Promise.all([placesP, sensorsP])
    .then(function(results){

        var places = results[0];
        var sensors = results[1];

        if (places){
            // sorting places alphabetically
            places.sort(function(a, b){
                return a.name > b.name ? 1 : -1;
            });
            // console.log('places', results[0]);

            var placeMap = makeMap(places, 'id');

            // establish set of sensors id
            placeMap.forEach(function(place){
                if (place.sensor_ids[0] !== null)
                    place.sensor_ids = new Set(place.sensor_ids);
                else
                    place.sensor_ids = new Set()
            });

            topLevelStore.placeMap = placeMap;

        }
        
        if (sensors){
            // sorting sensors by id
            sensors.sort(function(a, b){
                return a.id > b.id ? 1 : -1;
            });
            
            // console.log('sensors', results[1]);
            
            var sensorMap = makeMap(sensors, 'id');
            console.log('sensorMap', sensorMap);


            // transform dbStatus to constants
            sensorMap.forEach(function (sensor){
                var isConnected = new Date().getTime() - new Date(sensor.updated_at).getTime() <= 12 * HOUR;
                sensor.quipu_status = isConnected ? dbStatusMap.get(sensor.quipu_status) : "DISCONNECTED";
                sensor.sense_status = isConnected ? dbStatusMap.get(sensor.sense_status) : "";
            });

            topLevelStore.sensorMap = sensorMap;

            // change updating status
            if (updatingID) {
                var updatingAnt = topLevelStore.sensorMap.get(updatingID);
                updatingAnt.isUpdating = true;

                updatingID = undefined;

                setTimeout(function(){
                    resetUpdate(updatingAnt);
                    render();
                }, 500);
            }
        }
        
        render();
    })
    .catch(errlog);
}

function sendCommand(command, selectedAntSet){
    var antNames = [];
    selectedAntSet.forEach(function(id){
        antNames.push(topLevelStore.sensorMap.get(id).phone_number);
    });

    socket.emit('cmd', 
        {
            type:'cmd',
            command:command,
            to:antNames
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
// socket.on('data', function (msg){
//     var id = msg.socketMessage.sensor_id;
//     var signal = msg.socketMessage.quipu.signal;

//     var updatingAnt = topLevelStore.ants.get(id);
//     updatingAnt.signal = signal;

//     render();
// });

socket.on('status', function (msg) {

    // GET UPDATING SENSOR ID
    var id = msg.sensorId;
    console.log('UPDATING STATUS', id);
    
    updatingID = id;
    refreshView();
});


