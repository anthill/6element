"use strict";

var encodeForSMS = require('6sense/src/codec/encodeForSMS.js');
var request = require('request');

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
]

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
                From: numbers[Math.floor(Math.random()*11)],
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
                    console.log('[6element dashboard]', response.statusCode, body);
                }
            });
        });

    }, 3000);
}

module.exports = function(){
    doIt();
    
    // preventing calling twice
    doIt = undefined;
}

