"use strict";

/*
** This is the reception server for 6element.
** This code handle
**      -TCP connection with sensors
**      -connection monitoring (connected/disconnected) (commented)
**      -sensor's network monitoring (2G, EDGE, 3G ...) (commented)
**      -data reception, decoding, saving and forwarding to app/admin server
*/

var EventEmitter = require('events').EventEmitter;
require('es6-shim');
var net = require('net');
var database = require('../database');
var sixElementUtils = require('./6elementUtils.js');
var simulateSensorMeasurementArrivalTCP = require('./simulateSensorMeasurementArrivalTCP');

var clients = {};
//var timeout = 5;
var monitorPort = 4100;
var eventEmitter = new EventEmitter();

var DEBUG = process.env.NODE_ENV === "development" ? true : false;

var debug = function() {
    if (DEBUG) {
        [].unshift.call(arguments, "[DEBUG 6element] ");
        console.log.apply(console, arguments);
    }
}

var monitorIncoming = net.createServer(function(socket) { // Receive data from sensors

//  var interval;
    var save;

    console.log('Server listening on port ' + monitorPort)
    clients[getID(socket)] = {name: undefined, log: [], lastMsgDate: 0, connected: false, socket: socket};
    save = {client: clients[getID(socket)], id: getID(socket)};

//  interval = setInterval(detectDeadClient, timeout * 1000, clients[getID(socket)]); // initialize heartbeat

    // Handle messages
    socket.on('data', function(data) {
        data.toString().split("|").forEach(function(message){
            handleData(message, clients[getID(socket)]); // handle 6element specific datas
        });

//      if (data.toString() === "timeout?") {
//          socket.write("timeout"+timeout);
//      }
        if (data.toString().match("name=*")) {
            clients[getID(socket)].name = data.toString().substr(5);
            console.log(socket.remoteAddress + " is now known as " + clients[getID(socket)].name);
            socket.write("nameOK");
        }

//      var network = 1; // network connection (GPRS, EDGE, 3G, 3G+)
//
//      if (clients[getID(socket)] !== undefined) {
//
//          if (data.toString().match(/^net(\d)$/)) {
//              network = parseInt(data.toString().match(/^net(\d)$/)[1]);
//          }
//          else if (getLastItem(clients[getID(socket)].log) && getLastItem(clients[getID(socket)].log).network)
//              network = getLastItem(clients[getID(socket)].log).network;
//
//          if (clients[getID(socket)].connected === false ||
//              getLastItem(clients[getID(socket)].log).network !== network) {
//
//              if (clients[getID(socket)].connected === false)
//                  console.log(getClientName(clients[getID(socket)]) + " connected");
//
//              clients[getID(socket)].log.push( // update logs
//                  {timestamp: (new Date()).getTime(), event: "connected", network: network});
//              eventEmitter.emit("data",
//                  {type: "connection", data: clients[getID(socket)], network: network});
//
//              clients[getID(socket)].connected = true;
//          }
//          clients[getID(socket)].lastMsgDate = (new Date()).getTime();
//
//          clearInterval(interval); // reset heartbeat
//          interval = setInterval(detectDeadClient, timeout * 1000, clients[getID(socket)]);

//      }
    });

    // When client close the connection (we use the save here because socket == undefined)

    var endConnection = function() {
        if (save.client !== undefined) {
            save.client.connected = false;
//          save.client.log.push({timestamp: (new Date()).getTime(), event: "disconnected", network: 0});
//          eventEmitter.emit("data", {type: "disconnection", data: save.client, network: 0});
        }
//      clearInterval(interval);
        console.log("connection closed");
        delete clients[save.id];
    }

    socket.on('end', endConnection);

    socket.on('error', function(err) {
        console.log("[ERROR] " + (err ? err.code : "???") + " : " + (err ? err : "unknown"));
    });

});

monitorIncoming.on("listening", function(){
    // if dev mode simulate data
    if (process.env.NODE_ENV === "development") simulateSensorMeasurementArrivalTCP();
})

monitorIncoming.on('error', function(err) {
    console.log("[ERROR] : ", err.message);
    if (err.code.toString() === 'EADDRINUSE') {
        console.log("address in use, please retry later ...");
        process.exit(1);
    }
});

monitorIncoming.listen(monitorPort);

// Send datas to app and admin servers
var monitorOutgoing = net.createServer(function(socket) {

    eventEmitter.on("data", function(data){
        socket.write(JSON.stringify(data) + "|");
    });

    socket.on("error", function(err) {
        console.log("[ERROR] : ", err.message);
    });

});

monitorOutgoing.listen(process.env.INTERNAL_PORT ? process.env.INTERNAL_PORT : 55555);

monitorOutgoing.on('connection', function() {console.log('SOMEONE CONNECTED, WOOHOO !!!')});

// function getLastItem(array) {
//  if (!array || !array.length)
//      return undefined;
//  return array[array.length - 1];
// }

function getID(socket) {

    return (socket.remoteAddress + ":" + socket.remotePort);
}

// function getClientName(client) {

//  return (client === undefined ? undefined : client.name);
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
    socket.write('cmd:' + cmd);
    console.log('CMD-> ' + cmd)
}

// decode, print, stock, and send data for 6element
function handleData(dat, client) {

    var sensorP = database.Sensors.findByPhoneNumber(client.name);

    var messageP = sixElementUtils.printMsg(dat, client);

    Promise.all([sensorP, messageP])
    .then(function(values) {
        return ({sensor: values[0], message: values[1]});
    })

    .then(function(data) {

        switch (data.message.type) {
            case 'message':
                if (data.message.decoded === 'init') {
                    var date = new Date();
                    sendCommand(client.socket, 'date ' + date.toISOString())
                }
                break;

            case 'status':
                var msgStatus = JSON.parse(data.message.decoded);
                database.Sensors.update(data.sensor.id, {
                    latest_input: msgStatus.info.command,
                    latest_output: msgStatus.info.result,
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
