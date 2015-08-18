"use strict";

/*
** This is the reception server for 6element.
** This code handle
**      -TCP connection with sensors
**      -sensor's network monitoring (2G, EDGE, 3G ...)
**      -data reception, decoding, saving and forwarding to app/admin server
*/

var EventEmitter = require('events').EventEmitter;
require('es6-shim');
var net = require('net');
var makeTcpReceiver = require('./makeTcpReceiver');
var database = require('../database');
var sixElementUtils = require('./6elementUtils.js');
// var simulateSensorStatusArrivalTCP = require('./simulateSensorStatusArrivalTCP');

var phoneNumber2socket = {};
var monitorPort = 5100;
var eventEmitter = new EventEmitter();

var DEBUG = process.env.NODE_ENV === "development" ? true : false;

var debug = function() {
    if (DEBUG) {
        [].unshift.call(arguments, "[DEBUG 6element] ");
        console.log.apply(console, arguments);
    }
}



var tcpServerForSensors = net.createServer(function(tcpSocketSensor) {

    console.log("New socket to sensor.");
    var phoneNumber;

    var tcpSocketSensorReceiver = makeTcpReceiver(tcpSocketSensor, "\n");
    
    tcpSocketSensorReceiver.on('message', function(message) {

        console.log("received tcp data: ", message);

        // register the phonenumber corresponding to the socket
        if (message.match("phoneNumber=*")) {
            phoneNumber = message.substr(12);
            phoneNumber2socket[phoneNumber] = tcpSocketSensor;
            console.log(tcpSocketSensor.remoteAddress + " is now known as " + phoneNumber);
            var date = new Date();
            sendCommand(tcpSocketSensor, 'date ' + date.toISOString())

            // Send config to the sensor
            database.Sensors.findByPhoneNumber(phoneNumber)
            .then(function(sensor) {
                console.log('sending config')
                sendCommand(tcpSocketSensor, 'init '+ [sensor.data_period, sensor.start_time, sensor.stop_time].join(" "));
            })
            .catch(function(err) {
                console.log("[ERROR] Couldn't get sensor's config in DB :", err);
            })
        }

        // handle data
        else if (phoneNumber) {
            handleData(message, phoneNumber2socket[phoneNumber], phoneNumber);
        }

    });

    tcpSocketSensor.on('close', function() {
        console.log("connection closed");
        if (phoneNumber) {
            debug("Removing from phoneNumber2socket");
            delete phoneNumber2socket[phoneNumber];
        }
    });

    tcpSocketSensor.on('error', function(err) {
        console.log("[ERROR] " + (err ? err.code : "???") + " : " + (err ? err : "unknown"));
        if (phoneNumber) {
            debug("Removing from phoneNumber2socket");
            delete phoneNumber2socket[phoneNumber];
        }
    });

});

// tcpServerForSensors.on("listening", function(){
//     // if dev mode simulate data
//     if (process.env.NODE_ENV === "development") simulateSensorStatusArrivalTCP();
// })

tcpServerForSensors.on('error', function(err) {
    console.log("[ERROR] : ", err.message);
    if (err.code.toString() === 'EADDRINUSE') {
        console.log("address in use, please retry later ...");
        process.exit(1);
    }
});

tcpServerForSensors.listen(monitorPort);









// Send datas to app and admin servers
var tcpServerToAdminApp = net.createServer(function(tcpSocketAdminApp) {

    eventEmitter.on("data", function(data){
        tcpSocketAdminApp.write(JSON.stringify(data) + "\n");
    });

    tcpSocketAdminApp.on("error", function(err) {
        console.log("[ERROR] : ", err.message);
    });

});

tcpServerToAdminApp.listen(process.env.INTERNAL_PORT ? process.env.INTERNAL_PORT : 55555);

tcpServerToAdminApp.on('connection', function(tcpSocketAdminApp) {

    var tcpSocketAdminAppReceiver = makeTcpReceiver(tcpSocketAdminApp, "\n");

    tcpSocketAdminAppReceiver.on('message', function(message) {
        var data = JSON.parse(message);
        if (data.type === 'cmd') {

            data.to.forEach(function(antPhone){
                if (phoneNumber2socket[antPhone]){
                    sendCommand(phoneNumber2socket[antPhone], data.command);
                }
            });

        }
    });
    debug('connection on the internal socket')
});

// function getLastItem(array) {
//  if (!array || !array.length)
//      return undefined;
//  return array[array.length - 1];
// }

// function getID(socket) {

//     return (socket.remoteAddress + ":" + socket.remotePort);
// }

// function getClientName(client) {

//  return (client === undefined ? undefined : client.phoneNumber);
// }

// function detectDeadClient(client) { // TCP heartbeat
//  if (client.connected === true) {
//      console.log(getClientName(client) + " disconnected");
//      client.log.push({timestamp: (new Date()).getTime(), event: "disconnected", network: 0});
//      eventEmitter.emit("data", {type: "disconnection", data: client, network: 0});
//      client.connected = false;
//  }
// }

// send a command to a sensor by TCP
function sendCommand(socket, cmd) {
    socket.write('cmd:' + cmd + "\n");
    console.log('CMD-> ' + cmd)
}

// decode, print, stock, and send data for 6element
function handleData(dat, socket, phoneNumber) {

    var sensorP = database.Sensors.findByPhoneNumber(phoneNumber);

    var messageP = sixElementUtils.printMsg(dat, phoneNumber);

    Promise.all([sensorP, messageP])
    .then(function(values) {
        return ({sensor: values[0], message: values[1]});
    })

    .then(function(data) {

        switch (data.message.type) {
            case 'network':
                var signal = data.message.decoded.substr(3);
                database.Sensors.update(data.sensor.id, {signal: signal})
                .then(function() {
                    eventEmitter.emit('data', {type: 'status', data: {quipu: {signal: signal}}})
                })
                .catch(function(err) {
                    console.log('error : cannot store signal in DB :', err)
                })
                break;

            case 'message':
                if (data.message.decoded === 'init') {
                    var date = new Date();
                    sendCommand(socket, 'date ' + date.toISOString())
                }
                break;

            case 'status':
                var msgStatus = JSON.parse(data.message.decoded);
                var cmd = msgStatus.info.command.toLowerCase();

                new Promise(function (resolve, reject) {
                    switch (cmd) {
                        case 'changestarttime' :
                            if (msgStatus.info.result === 'KO')
                                reject('KO');
                            database.Sensors.update(data.sensor.id, {start_time: parseInt(msgStatus.info.result)})
                            .then(resolve());
                            break;
                        case 'changestoptime' :
                            if (msgStatus.info.result === 'KO')
                                reject('KO');
                            database.Sensors.update(data.sensor.id, {stop_time: parseInt(msgStatus.info.result)})
                            .then(resolve());
                            break;
                        case 'changeperiod' :
                            if (msgStatus.info.result === 'KO')
                                reject('KO');
                            database.Sensors.update(data.sensor.id, {data_period: parseInt(msgStatus.info.result)})
                            .then(resolve());
                            break;
                    }
                })
                .then(function() {
                    debug(cmd + ' result successfully stored in database');
                })
                .catch(function(err) {
                    console.log('error : ' + 'cannot store result of ' + cmd + ' in database ('+err+')')
                });

                database.Sensors.update(data.sensor.id, (msgStatus.info.command !== 'null') ?
                    { // If status + command result
                        latest_input: msgStatus.info.command,
                        latest_output: msgStatus.info.result,
                        quipu_status: msgStatus.quipu.state,
                        sense_status: msgStatus.sense
                    } : 
                    { // If only status
                        quipu_status: msgStatus.quipu.state,
                        sense_status: msgStatus.sense
                    })
                .then(function(){
                    debug('id', data.sensor.id);
                    debug('Storage Success');
                    return {
                        sensorId: data.sensor.id,
                        socketMessage: msgStatus
                    };
                })
                .then(function(result) { // Send data to admin
                    eventEmitter.emit('data', {type: 'status', data: result});
                })
                .catch(function(err){
                    console.log("Storage FAILURE: ", err);
                });
                break;

            case 'data':
                var msgDatas = JSON.parse(data.message.decoded);
                Promise.all(msgDatas.map(function(msgData){
                    var messageContent = {
                        'sensor_id': data.sensor.id,
                        'signal_strengths': msgData.signal_strengths,
                        'measurement_date': msgData.date
                    };
                    var socketMessage = Object.assign({}, messageContent);
                    socketMessage['installed_at'] = data.sensor.installed_at;

                    // persist message in database
                    if (msgData.date) {
                        return database.SensorMeasurements.create(messageContent)
                        .then(function(id) {
                            return {
                                sensorMeasurementId: id,
                                measurement: socketMessage
                            }
                        })
                        .catch(function(error){
                            console.log("Storage FAILURE: ", error);
                        });
                    }
                }))
                .then(function(results) { // Send data to app
                    debug('Storage SUCCESS');
                    eventEmitter.emit('data', {type: 'data', data: results});
                })
                .catch(function(err) {
                    console.log("Storage FAILURE: ", err);
                })
                break;
        }
    })
    .catch(function(err){
        console.log('ERROR : ' + err);
    });
}
