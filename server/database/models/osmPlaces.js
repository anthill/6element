'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');
var osmPlaces = require('../management/declarations.js').osmplaces;
var networks = require('../management/declarations.js').networks;
var categories = require('../management/declarations.js').categories;


function jsArrayToPg(nodeArray) {
    return "ARRAY['" + nodeArray.join("','") + "']";
}

module.exports = {

    // ------------- BASICS ---------------

    create: function(osmPlacesData){
        if(!Array.isArray(osmPlacesData))
            osmPlacesData = [osmPlacesData];
        
        return databaseP.then(function (db) {

            return Promise.all(osmPlacesData.map(function(data){

                var query = osmPlaces
                    .insert(data)
                    .returning('*')
                    .toQuery();

                // console.log('osmPlaces create query', query);

                return new Promise(function (resolve, reject) {
                    db.query(query, function (err, result) {
                        if (err) {
                            console.log("ERROR in createByChunk", query, err.stack);
                            reject(err);
                        }
                        else resolve(result.rows);
                    });
                });
            }));
        })
        .catch(function(err){
            console.error('ERROR in createByChunk', err.stack);
        });
    },

    count: function () {
        return databaseP.then(function (db) {
            var query = osmPlaces
                .select(osmPlaces.count().as('count'))
                .toQuery();

            // console.log('osmPlaces count query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) {
                        console.error("ERROR in count", query, err);
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
            
            var strDistance = "st_distance_sphere(osmPlaces.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) ";
            var strDistanceAS = strDistance + "AS distance";
            var query = osmPlaces
                .select(osmPlaces.star(), strDistanceAS)
                .from(osmPlaces)
                .where(strDistance + "< 50000 and type = 'centre'")
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
    
    getWithin: function(coords, bbox, subCategories, limit){
        return databaseP.then(function (db) {
            
            var strDistance = "st_distance_sphere(osmPlaces.geom, st_makepoint(" + coords.lon + ", " + coords.lat + ")) AS distance";
            var filters = subCategories[0] === "All" ? "": " AND  osmPlaces.objects ?| " + jsArrayToPg(subCategories);
            var query = osmPlaces
                .select(osmPlaces.star(), categories.name.as('category'), categories.color.as('color'), strDistance)
                .from(osmPlaces.join(categories).on(osmPlaces.category.equals(categories.name)))
                .where("osmPlaces.geom && ST_MakeEnvelope(" + bbox.minLon + ", " + bbox.minLat + ", " + bbox.maxLon + ", " + bbox.maxLat + ", 4326)")
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
            console.log('ERROR in getWithin', err, err.stack);
        }); 
    }
};
