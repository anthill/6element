"use strict";

var moment = require('moment');

var database = require('../database');


module.exports = function(){
    return Promise.all([
        database.RecyclingCenters.create({
            name: "Saint-Mariens",
            lat: 45.114175375,
            lon: -0.389916104
        }),
        database.RecyclingCenters.create({
            name: "Saint-Denis de Pile",
            lat: 44.998070, 
            lon: -0.157079
        }),
        database.RecyclingCenters.create({
            name: "Libourne-Epinette",
            lat: 44.906571,
            lon: -0.215062
        }),
        database.RecyclingCenters.create({
            name: "Libourne-Ballastière",
            lat: 44.944505,
            lon: -0.235283
        }),
        database.RecyclingCenters.create({
            name: "Vérac",
            lat: 44.997404,
            lon: -0.358290
        }),
        database.RecyclingCenters.create({
            name: "Saint-Gervais",
            lat: 45.010882983,
            lon: -0.4692538 
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
