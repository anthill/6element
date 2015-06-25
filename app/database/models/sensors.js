"use strict";

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');

var sensors = require('../management/declarations.js').sensors;

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
    },

    getAllSensors: function() {
        return databaseP.then(function (db) {
            
            var query = sensors
                .select("*")
                .from(sensors)
                .toQuery();

            // console.log('sensors query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows);
                });
            });
        })        
    }

};
