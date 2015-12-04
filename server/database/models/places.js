'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var hstore = require('pg-hstore')();
var databaseP = require('../management/databaseClientP');
var places = require('../management/declarations.js').places;
var networks = require('../management/declarations.js').networks;

var jsArrayToPg = function(nodeArray) {
    return "ARRAY['" + nodeArray.join("','") + "']";
}

module.exports = {

    createByChunk: function (datas) {
        return databaseP.then(function (db) {

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
                            reject(err);
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

    getWithin: function(coords, bbox, categories, limit){
        return databaseP.then(function (db) {
            
            var strDistance = "st_distance_sphere(places.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) AS distance";
            var filters = categories[0] === "All" ? "": " AND  places.objects ?| " + jsArrayToPg(categories);
            var query = places
                .select(places.star(),networks.name.as('file'), networks.color.as('color'), strDistance)
                .from(places.join(networks).on(places.network.equals(networks.id)))
                .where("places.geom && ST_MakeEnvelope(" + bbox.minLon + ", " + bbox.minLat + ", " + bbox.maxLon + ", " + bbox.maxLat + ", 4326)" + filters)
                .order("distance")
                .limit(limit)
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
        return databaseP.then(function (db) {
            
            var strDistance = "st_distance_sphere(places.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) ";
            var strDistanceAS = strDistance + "AS distance";
            var filters = categories[0] === "All" ? "": " AND  places.objects ?| " + jsArrayToPg(categories);
            var query = places
                .select(places.star(),networks.name.as('file'), networks.color.as('color'), strDistanceAS)
                .from(places.join(networks).on(places.network.equals(networks.id)))
                .where(strDistance + "< 50000" + filters)
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

    getBins: function(pheromonId){
        return databaseP.then(function (db) {

            var query = places
                .select(places.bins)
                .where(places.pheromon_id.equals(pheromonId))
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) {
                        console.log("ERROR in searching bins", query);
                        reject(err);
                    }
                    else{
                        if(result.rows[0].bins == null) resolve (undefined);
                        else resolve(result.rows[0].bins);
                    } 
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in get Bins', err);
        });
    },

    updateBins: function(pheromonId, bins){
        return databaseP.then(function (db) {
            
            var query = places
            .update({'bins': bins})
            .where(places.pheromon_id.equals(pheromonId))
            .returning(places.bins)
            .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in update Bins', err);
        });
    },

    updateBin: function(pheromonId, bin){

        var self = this;
        return this.getBins(pheromonId)
            .then(function(bins){

                return new Promise(function (resolve, reject) {
                    var index = bins.findIndex(function(elt){
                        return elt.id === bin.id;
                    })

                    if(index === -1) reject('Bin with id=' + bin.id + ' unfound');
                    else {
                        bins[index] = bin;
                        self.updateBins(pheromonId, bins)
                        .then (function(){
                            resolve(true);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                    }
                });
            })
            .catch(function(err){
                console.log('ERROR in getting Bin', err);
            });
    }
};
