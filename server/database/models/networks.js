'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var connectToDB = require('../management/connectToDB.js');

var networks = require('../management/declarations.js').networks;

module.exports = {
    create: function (data) {
        return connectToDB().then(function (db) {
            
            var query = networks
                .insert(data)
                .returning('*')
                .toQuery();

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

                var query = networks
                    .insert(data)
                    .returning('*')
                    .toQuery();
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

    update: function(id, delta) {
        return connectToDB().then(function (db) {
            
            var query = networks
                .update(delta)
                .where(networks.id.equals(id))
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
            
            var query = networks
                .select('*')
                .where(networks.id.equals(id))
                .from(networks)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getNetwork', err);
        }); 
    },

    getAll: function() {
        return connectToDB().then(function (db) {
            
            var query = networks
                .select('*')
                .from(networks)
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
            
            var query = networks
                .delete()
                .where(networks.id.equals(id))
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
            console.log('ERROR in delete networks', err);
        });        
    },

};
