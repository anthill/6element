'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var connectToDB = require('../management/connectToDB.js');

var places = require('../management/declarations.js').places;

module.exports = {
    create: function (data) {
        return connectToDB().then(function (db) {
            
            var query = places
                .insert(data)
                .returning('*')
                .toQuery();

            // console.log('places create query', query);

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
                            console.log("EROR in saving entry", query);
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

    update: function(id, delta) {
        return connectToDB().then(function (db) {
            
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
        return connectToDB().then(function (db) {
            
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
        return connectToDB().then(function (db) {
            
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
        return connectToDB().then(function (db) {
            
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
        return connectToDB().then(function (db) {
            
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
