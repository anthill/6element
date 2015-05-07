"use strict";

require('es6-shim');

var dropAllTables = require('../database/management/dropAllTables');
var createTables = require('../database/management/createTables');

var database = require('../database');

// if(process.env.NODE_ENV !== "production") // commented for now. TODO Find proper way to handle both prod & dev envs
dropAllTables()
    .then(createTables)
    .then(function(){
        return database.Sensors.create({
            name: 'bla'
        })
    })
    .then(function(res){
        console.log('success!', res);
    })
    .catch(function(err){
        console.error('some error', err);
    })

