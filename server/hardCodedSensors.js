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
        }),
        database.RecyclingCenters.create({
            name: "The North Face",
            // random location around Bordeaux
            lat: 44.839720, 
            lon: -0.578130
        }),
        database.RecyclingCenters.create({
            name: "Ponpon",
            // random location around Bordeaux
            lat: 44.845449, 
            lon: -0.577541
        }),
        database.RecyclingCenters.create({
            name: "Région Aquitaine",
            // random location around Bordeaux
            lat: 44.843099,
            lon: -0.571126
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
            }),
            database.Sensors.create({
                name: "ant3",
                installed_at: rcIds[2],
                phone_number: "+33783609060"
            }),
            database.Sensors.create({
                name: "ant4",
                installed_at: rcIds[3],
                phone_number: "+33781899027"
            }),
            database.Sensors.create({
                name: "ant5",
                installed_at: rcIds[4],
                phone_number: "+33783959384"
            })
        ])

    });
};
