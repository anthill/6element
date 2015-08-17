"use strict";

var net = require('net');

var encodeForSMS = require('6sense/src/codec/encodeForSMS.js');

var numbers = [
    "+33781095259",
    "+33783720119",
    "+33783609060",
    "+33783881878",
    "+33783629109",
    "+33783699454",
    "+33783585494",
    "+33783818983",
    "+33783734218",
    "+33783875081",
    "+33781899027",
    "+33783959384"
];




function doIt(){

    var endpointConfig = {
        host: "127.0.0.1",
        port: 5100
    };
    var endpoint = net.connect(endpointConfig, function(){

        endpoint.on("data", function(buffer){

            if (buffer.toString() === "nameOK"){
        
                var now = new Date().toISOString();

                var nbMeasurements = Math.floor(Math.random()*10);
                var dummyArray = [];
                for (var i = 0; i < nbMeasurements; i++) { 
                    dummyArray.push(Math.floor(Math.random()*40));
                }

                var measurement = {
                    date: now,
                    signal_strengths: dummyArray
                };

                encodeForSMS([measurement]).then(function(sms){
                    endpoint.write('1' + sms + "|");
                });
            }
        });

        setInterval(function(){
            // choose sensor
            endpoint.write("name=" + numbers[Math.floor(Math.random()*11)]);

        }, 10000);

    });
}


module.exports = function(){
    doIt();
    
    // preventing calling twice
    doIt = undefined;
}

