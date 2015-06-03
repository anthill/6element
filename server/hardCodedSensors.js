"use strict";

var moment = require('moment');

var database = require('../database');


module.exports = new Promise(function(resolve, reject){

    database.RecyclingCenters.create({
        name: "LeNode",
        // random location around Bordeaux
        lat: -0.570517,
        lon: 44.840207
    }).then(function(rcId){
        database.Sensors.create({
            name: "ant2",
            installed_at: rcId,
            phone_number: "xxx"
        }).then(function(id){
            resolve(id);
        }).catch(function(err){reject(err)})
    }).catch(function(err){reject(err)});
});