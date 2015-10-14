'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var connectToDB = require('../management/connectToDB.js');

var places = require('../management/declarations.js').places;
var networks = require('../management/declarations.js').networks;

var jsArrayToPg = function(nodeArray) {
    return "ARRAY['" + categories.join("','") + "']";
}

module.exports = {

    createByChunk: function (datas) {
        return connectToDB().then(function (db) {

            return Promise.all(datas.map(function(data){

                var query = places
                    .insert(data)
                    .returning('*')
                    .toQuery();

                // console.log('places create query', query);

                return new Promise(function (resolve, reject) {
                    db.query(query, function (err, result) {
                        if (err) {
                            console.log("ERROR in saving entry", query);
                        }
                        else resolve(result.rows);
                    });
                });
            }))
        })
        .catch(function(err){
            console.log('ERROR in create bulk', err);
        });
    },

    getWithin: function(coords, bbox, categories){
        return connectToDB().then(function (db) {
            
            var strDistance = "st_distance_sphere(places.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) AS distance";
            var filters = categories[0] === "All" ? "": " AND  places.objects ?| " + jsArrayToPg(categories);
            var query = places
                .select(places.star(),networks.name.as('file'), networks.color.as('color'), strDistance)
                .from(places.join(networks).on(places.network.equals(networks.id)))
                .where("places.geom && ST_MakeEnvelope(" + bbox.minLon + ", " + bbox.minLat + ", " + bbox.maxLon + ", " + bbox.maxLat + ", 4326)" + filters)
                .order("distance")
                .limit(100)
                .toQuery();

   
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getWithin', err);
        }); 
    },

    getKNearest: function(coords, k, categories){
        return connectToDB().then(function (db) {
            
            var strDistance = "st_distance_sphere(places.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) AS distance";
            var filters = categories[0] === "All" ? "TRUE": "places.objects ?| " + jsArrayToPg(categories);
            var query = places
                .select(places.star(),networks.name.as('file'), networks.color.as('color'), strDistance)
                .from(places.join(networks).on(places.network.equals(networks.id)))
                .where(filters)
                .order("distance")
                .limit(k)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getKNearest', err);
        }); 
    },
};
