"use strict";

var moment = require('moment');

var database = require('../database');


module.exports = function(){
    return database.RecyclingCenters.create({
        name: "LeNode",
        // random location around Bordeaux
        lat: -0.570517,
        lon: 44.840207
    }).then(function(rcId){
        return database.Sensors.create({
            name: "ant2",
            installed_at: rcId,
            phone_number: "xxx"
        });
    });
};