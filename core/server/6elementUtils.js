"use strict";

var sixSenseDecoder = require('6sense/src/codec/decodeFromSMS.js');
var genericCodec = require('quipu/parser.js');
require('es6-shim');


function getDataType(data) {
	if (data.toString().match(/^net(NODATA|GPRS|EDGE|3G|H\/H+)$/))
		return 'network'
	else if (data.toString().match("phoneNumber=*"))
		return 'request'
	else if (data.toString().slice(0, 1) === '0')
		return 'message'
	else if (data.toString().slice(0, 1) === '1')
		return 'data'
	else if (data.toString().slice(0, 1) === '2')
		return 'status'
	else
		return 'other'
}

function printMsg(msg, phoneNumber) {
	return new Promise(function(resolve) {
		decode(msg)
		.then(function(decoded) {
			var type = getDataType(msg);
			switch (type) {
				case 'network':
					console.log('['+phoneNumber+']'+"[NETWORK]>" + decoded.toString());
					break;
				case 'request':
					console.log('['+phoneNumber+']'+"[REQUEST]>" + decoded.toString());
					break;
				case 'message':
					console.log('['+phoneNumber+']'+"[MESSAGE]>" + decoded.toString());
					break;
				case 'data':
					console.log('['+phoneNumber+']'+"[DATA]   >" + decoded.toString());
					break;
				case 'status':
					console.log('['+phoneNumber+']'+"[STATUS] >" + decoded.toString());
					break;
				default:
					console.log('['+phoneNumber+']'+"[OTHER]  >" + decoded.toString());
					break;
			}

			resolve({decoded: decoded.toString(), type: type});
		})
	});
}

// Decode any message received by SMS or TCP
function decode(message) {

	return new Promise(function(resolve){

		switch (message[0]) {
			case '0': // message : not encoded
				resolve(message.slice(1));
				break;

			case '1': // data : 6sense_encoded
				sixSenseDecoder(message.slice(1).toString())
					.then(function(decodedMessage){
						resolve(JSON.stringify(decodedMessage));
					})
					.catch(function(err){
						console.log("error in case 1 ", err);
					})
				break;

			case '2': // status : generic_encoded
				genericCodec.decode(message.slice(1).toString())
					.then(function(decodedMessage){
						resolve(JSON.stringify(decodedMessage));
					})
					.catch(function(err){
						console.log("error in case 2 ", err);
					})
				break;
				
			default :
				resolve(message); // not a message, data or status (can be a network, phoneNumber, etc...)
				break;
		}

	})
	
}

module.exports = {printMsg: printMsg, decode: decode, getDataType: getDataType};
