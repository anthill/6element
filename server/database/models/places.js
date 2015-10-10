'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var places = require('../management/declarations.js').places;

module.exports = {
    create: function (data) {
        return databaseP.then(function (db) {
            
            var query = places
                .insert(data)
                .returning('*')
                .toQuery();

            //console.log('places create query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in create', err);
        });
    },

    update: function(id, delta) {
        return databaseP.then(function (db) {
            
            var query = places
                .update(delta)
                .where(places.id.equals(id))
                .returning('*')
                .toQuery();

            //console.log('sensors findByPhoneNumber query', query);
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in update', err);
        });        
    },

    get: function(id){
        return databaseP.then(function (db) {
            
            var query = places
                .select('*')
                .where(places.id.equals(id))
                .from(places)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getPlace', err);
        }); 
    },

    getAll: function() {
        return databaseP.then(function (db) {
            
            var query = places
                .select('*')
                .from(places)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getAllPlaces', err);
        });        
    },

    delete: function(id) {
        return databaseP.then(function (db) {
            
            var query = places
                .delete()
                .where(places.id.equals(id))
                .returning('*')
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else
                        resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in delete places', err);
        });        
    },

    deleteAll: function() {
        return databaseP.then(function (db) {
            
            var query = places
                .delete()
                .returning('*')
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in deleteAll places', err);
        });        
    }
};
