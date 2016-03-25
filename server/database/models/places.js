'use strict';

var sql = require('sql');
sql.setDialect('postgres');

var databaseP = require('../management/databaseClientP');
var places = require('../management/declarations.js').places;

var assignColors = require('../../assignColors.js');

module.exports = {

    // ------------- BASICS ---------------

    create: function(placesData){
        if(!Array.isArray(placesData))
            placesData = [placesData];
        
        return databaseP.then(function (db) {

            return Promise.all(placesData.map(function(data, index){
                if (data){
                    var query = places
                    .insert(data)
                    .returning('*')
                    .toQuery();

                    // console.log('places create query', query);

                    return new Promise(function (resolve, reject) {
                        db.query(query, function (err, result) {
                            if (err) {
                                console.log('!!!! ERROR in createByChunk', query, err);
                                reject(err);
                            }
                            else resolve(result.rows);
                        });
                    });
                }
                else return Promise.reject(new Error('Place data is undefined'));
            
            }));
        })
        .catch(function(err){
            console.error('ERROR in createByChunk', err);
        });
    },

    count: function () {
        return databaseP.then(function (db) {
            var query = places
                .select(places.count().as('count'))
                .toQuery();

            // console.log('places count query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) {
                        console.error('ERROR in count', query, err);
                        reject(err);
                    }
                    else resolve(Number(result.rows[0].count));
                });
            });
        });
    },


    // ------------- GETTERS ---------------

    getKNearest: function(coords, k){
        return databaseP.then(function (db) {
            
            var strDistance = "st_distance_sphere(places.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) ";
            var strDistanceAS = strDistance + "AS distance";
            var query = places
                .select(places.star(), strDistanceAS)
                .from(places)
                .where(strDistance + "< 50000 and type = 'centre'")
                .order("distance")
                .limit(k)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(assignColors(result.rows));
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getKNearest', err);
        }); 
    },

    getByIds: function(placeIds){
        return databaseP.then(function (db) {

            var query = places
                .select(places.star())
                .from(places)
                .where(places.id.in(placeIds))
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) {
                        console.log("ERROR in searching place", query);
                        reject(err);
                    }
                    else resolve(assignColors(result.rows));
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in get Place', err);
        });
    },

    getByOperator: function(operatorName){
        return databaseP.then(function (db) {

            var query = places
                        .select("*")
                        .from(places)
                        .where(places.owner.equals(operatorName))
                        .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) {
                        console.log("ERROR in searching place by operatorName", query);
                        reject(err);
                    }
                    else resolve(result.rows); 
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in get getByOperator', err);
        });
    },

    getWithin: function(coords, bbox, categories, limit){
        return databaseP.then(function (db) {
            
            var strDistance = "st_distance_sphere(places.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) AS distance";
            var query = places
                .select(places.star(), strDistance)
                .from(places)
                .where("places.geom && ST_MakeEnvelope(" + bbox.minLon + ", " + bbox.minLat + ", " + bbox.maxLon + ", " + bbox.maxLat + ", 4326)")
                .order("distance")
                .limit(limit)
                .toQuery();

   
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(assignColors(result.rows));
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getWithin', err, err.stack);
        }); 
    },

    // ------------- BINS ---------------

    getBins: function(pheromonId){
        return databaseP.then(function (db) {

            var query = places
                .select(places.bins, places.owner)
                .where(places.pheromon_id.equals(pheromonId))
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) {
                        console.log("ERROR in searching bins", query);
                        reject(err);
                    }
                    else{
                        if(result.rows[0].bins === undefined) resolve (undefined);
                        else resolve(result.rows[0]);
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

    updateBinsById: function(id, bins){
        return databaseP.then(function (db) {
            
            var query = places
            .update({'bins': bins})
            .where(places.id.equals(id))
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
            .then(function(object){

                return new Promise(function (resolve, reject) {
                    var index = object.bins.findIndex(function(elt){
                        return elt.id === bin.id;
                    });

                    if(index === -1) reject('Bin with id=' + bin.id + ' unfound');
                    else {
                        object.bins[index] = bin;
                        self.updateBins(pheromonId, object.bins)
                        .then (function(){
                            resolve(true);
                        })
                        .catch(function(err){
                            reject(err);
                        });
                    }
                });
            })
            .catch(function(err){
                console.log('ERROR in getting Bin', err);
            });
    }
};
