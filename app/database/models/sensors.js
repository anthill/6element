"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var sensors = require('../management/declarations.js').sensors;
var recyclingCenters = require('../management/declarations.js').recycling_centers;

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
    
    update: function(sensor, delta) {
        return databaseP.then(function (db) {
            
            var query = sensors
                .update(delta)
                .where(sensors.id.equals(sensor.id))
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
                    recyclingCenters.name.as('rcName'),
                    recyclingCenters.lat,
                    recyclingCenters.lon
                )
                .from(
                    sensors
                    .join(recyclingCenters)
                    .on(sensors.installed_at.equals(recyclingCenters.id))
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
