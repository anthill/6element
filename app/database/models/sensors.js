"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var sensors = require('../management/declarations.js').sensors;
var places = require('../management/declarations.js').places;

module.exports = {
    create: function (data) {
        return databaseP.then(function (db) {
            
            var query = sensors
                .insert(data)
                .returning('id')
                .toQuery();

            //console.log('sensors create query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0].id);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in create', err);
        });  
    },
    findByPhoneNumber: function(phoneNumber) {
        return databaseP.then(function (db) {
            
            var query = sensors
                .select("*")
                .from(sensors)
                .where(sensors.phone_number.equals(phoneNumber))
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
            console.log('ERROR in findByPhoneNumber', err);
        });          
    },
    
    update: function(id, delta) {
        return databaseP.then(function (db) {
            
            var query = sensors
                .update(delta)
                .where(sensors.id.equals(id))
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

    getAllSensorsInfo: function() {
        return databaseP.then(function (db) {
            
            var query = sensors
                .select(
                    sensors.star(),
                    places.name,
                    places.type,
                    places.lat,
                    places.lon
                )
                .from(
                    sensors
                    .join(places)
                    .on(sensors.installed_at.equals(places.id))
                )
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getAllSensorsInfo', err);
        });        
    }

};
