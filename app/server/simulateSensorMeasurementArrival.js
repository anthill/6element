"use strict";

var encodeForSMS = require('6sense/src/codec/encodeForSMS.js');
var request = require('request');

function doIt(){
    setInterval(function(){
        var now = new Date().toISOString();

        var nbMeasurements = Math.floor(Math.random()*10);
        var dummyArray = [];
        for (var i = 0; i < nbMeasurements; i++) { 
            dummyArray.push(Math.floor(Math.random()*40));
        }

        var result = {
            date: now,
            signal_strengths: dummyArray
        };

        console.log('new measure', result.signal_strengths.length);

        encodeForSMS([result]).then(function(sms){

            var toSend = {
                From: '+33783699454',
                Body: '1' + sms
            };

            request.post({
                url: 'http://localhost:4000/twilio',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toSend)
            }, function(error, response, body){
                if(error) {
                    console.log("ERROR:", error);
                } else {
                    console.log('[6element app]', response.statusCode, body);
                }
            });
        });

    }, 30000);
}

module.exports = function(){
    doIt();
    
    // preventing calling twice
    doIt = undefined;
}

