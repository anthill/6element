'use strict';

var sql = require('sql');
sql.setDialect('postgres');
var databaseP = require('../management/databaseClientP');
var getRandomName = require('pokemon-names').random;

var sensors = require('../management/declarations.js').sensors;
var sensorCache = 'RIEN';

module.exports = {
    cache: function(){
        return sensorCache;
    },
    create: function (data) {
        sensorCache = 'TEST';

        return databaseP.then(function (db) {

            if (data.sim === undefined || (typeof(data.sim) === 'string' && !data.sim.length)) {
                throw 'Cannot create sensor : no SIM';
            }
            if (!data.name)
                data.name = getRandomName();
            var query = sensors
                .insert(data)
                .returning('*')
                .toQuery();

            //console.log('sensors create query', query);
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else{
                        sensorCache = 'QUELQUE CHOSE';
                        resolve(result.rows[0]);
                    }
                        
                        
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in create', err);
        });
    },
    
    update: function(sim, delta) {
        return databaseP.then(function (db) {
            var query = sensors
                .update(delta)
                .where(sensors.sim.equals(sim))
                .returning('*')
                .toQuery();

            //console.log('sensors findBySIMid query', query);
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err)
                        reject(err);
                    else {
                        console.log('UPDATED', result.rows[0]);
                        resolve(result.rows[0]);
                    }
                        
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in update', err);
        });        
    },

    get: function(sim){
        return databaseP.then(function (db) {
            
            var query = sensors
                .select('*')
                .where(sensors.sim.equals(sim))
                .from(sensors)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getSensor', err);
        }); 
    },

    getAll: function() {
        return databaseP.then(function (db) {
            
            var query = sensors
                .select('*')
                .from(sensors)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else
                        resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getAllSensors', err);
        });        
    },

    delete: function(id) {
        return databaseP
        .then(function (db) {
            
            var query = sensors
                .delete()
                .where(sensors.sim.equals(id))
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
            console.log('ERROR in delete sensors', err);
        });        
    },

    deleteAll: function() {
        return databaseP
        .then(function (db) {
            
            var query = sensors
                .delete()
                .returning('*')
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else
                        resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in deleteAll sensors', err);
        });        
    }
};
