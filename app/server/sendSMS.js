"use strict";

var PRIVATE = require('../PRIVATE.json');

var client = require('twilio')(PRIVATE.twilio_ssi, PRIVATE.twilio_pwd);

module.exports = function(body, destination){
    client.sendMessage({

        to: destination,
        from: PRIVATE.twilio_number,
        body: body

    }, function(err, responseData) {

        if (err)
            console.log("ERROR sending with twilio: ", err);

    });
}