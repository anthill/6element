"use strict";

var database = require('../database');

module.exports = function(){
    return Promise.all([
        database.Places.create({
            name: "Saint-Mariens", // 0
            type: "recyclingCenter",
            lat: 45.114175375,
            lon: -0.389916104
        }),
        database.Places.create({
            name: "Saint-Denis de Pile", // 1
            type: "recyclingCenter",
            lat: 44.998070, 
            lon: -0.157079
        }),
        database.Places.create({
            name: "Libourne-Epinette", // 2
            type: "recyclingCenter",
            lat: 44.906571,
            lon: -0.215062
        }),
        database.Places.create({
            name: "Libourne-Ballastière", // 3
            type: "recyclingCenter",
            lat: 44.944505,
            lon: -0.235283
        }),
        database.Places.create({
            name: "Vérac",            // 4
            type: "recyclingCenter",
            lat: 44.997404,
            lon: -0.358290
        }),
        database.Places.create({
            name: "Saint-Gervais",   // 5
            type: "recyclingCenter",
            lat: 45.010882983,
            lon: -0.4692538 
        }),
        database.Places.create({
            name: "Coutras",      // 6
            type: "recyclingCenter",
            lat: 45.036296,
            lon: -0.101169
        }),
        database.Places.create({
            name: "Alex' home",  // 7
            type: "overlord",
            lat: 44.831352, 
            lon: -0.583721
        }),
        database.Places.create({
            name: "A",           // 8
            lat: 44.840420, 
            lon: -0.570474
        }),
        database.Places.create({
            name: "B",          // 9
            lat: 44.893405, 
            lon: -1.211830
        }),
        database.Places.create({
            name: "C",         // 10
            lat: 44.831352, 
            lon: -0.583721
        }),
        database.Places.create({
            name: "D",         // 11
            lat: 44.840420, 
            lon: -0.570474
        })
    ])
    .then(function(placesId){
        return Promise.all([
            database.Sensors.create({
                name: "ant1",
                installed_at: placesId[0],
                phone_number: "+33781095259"
            }),
            database.Sensors.create({
                name: "ant2",
                installed_at: placesId[1],
                phone_number: "+33783720119"
            }),
            database.Sensors.create({
                name: "ant3",
                installed_at: placesId[2],
                phone_number: "+33783609060"
            }),
            database.Sensors.create({
                name: "ant8",
                installed_at: placesId[3],
                phone_number: "+33783881878"
            }),
            database.Sensors.create({
                name: "ant6",
                installed_at: placesId[4],
                phone_number: "+33783629109"
            }),
            database.Sensors.create({
                name: "ant10",
                installed_at: placesId[5],
                phone_number: "+33783699454"
            }),
            database.Sensors.create({
                name: "ant7",
                installed_at: placesId[6],
                phone_number: "+33783585494"
            }),
            database.Sensors.create({
                name: "ant9",
                installed_at: placesId[7],
                phone_number: "+33783818983"
            }),
            database.Sensors.create({
                name: "ant12",
                installed_at: placesId[8],
                phone_number: "+33783734218"
            }),
            database.Sensors.create({
                name: "ant11",
                installed_at: placesId[9],
                phone_number: "+33783875081"
            }),
            database.Sensors.create({
                name: "ant4",
                installed_at: placesId[10],
                phone_number: "+33781899027"
            }),
            database.Sensors.create({
                name: "ant5",
                installed_at: placesId[11],
                phone_number: "+33783959384"
            })
        ])

    });
};
