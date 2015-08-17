"use strict";

var net = require('net');

var encode = require('quipu/parser.js').encode;

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


var quipuStatus = [
    'uninitialized',
    'initialized',
    '3G_connected',
    'tunnelling'
];

var senseStatus = [
    'sleeping',
    'monitoring',
    'recording'
];


function doIt(){

    var endpointConfig = {
        host: "127.0.0.1",
        port: 5100
    };
    var endpoint = net.connect(endpointConfig, function(){


        endpoint.on("data", function(buffer){

            if (buffer.toString().match("cmd:date*")){
            
                var status = {
                    quipu: {
                        state: quipuStatus[Math.floor(Math.random()*3)],
                        signal: '3G'
                    },
                    sense: senseStatus[Math.floor(Math.random()*2)],
                    info: {
                        command: 'myCommand',
                        result: 'OK'
                    }
                };

                console.log('Sending status to ant');

                encode(status).then(function(sms){
                    endpoint.write('2' + sms + "|");
                });
            }
        });


        setInterval(function(){
            // choose sensor
            endpoint.write("phoneNumber=" + numbers[Math.floor(Math.random()*11)]);

        }, 10000);

    });
}


module.exports = function(){
    doIt();
    
    // preventing calling twice
    doIt = undefined;
}

