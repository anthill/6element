"use strict";

var moment = require('moment');

var database = require('../database');


module.exports = function(){
    return Promise.all([
        database.RecyclingCenters.create({
            name: "Le Node",
            // random location around Bordeaux
            lat: 44.840207,
            lon: -0.570517
        }),
        database.RecyclingCenters.create({
            name: "Le Cheverus",
            // random location around Bordeaux
            lat: 44.837883, 
            lon: -0.575538
        })
    ])
    .then(function(rcIds){
        return Promise.all([
            database.Sensors.create({
                name: "ant1",
                installed_at: rcIds[0],
                phone_number: "+33781095259"
            }),
            database.Sensors.create({
                name: "ant2",
                installed_at: rcIds[1],
                phone_number: "+33783720119"
            })
        ])

    });
};