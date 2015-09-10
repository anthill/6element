"use strict";

// when ready, drop and create tables
var databaseClientP = require('./core/database/management/databaseClientP');

var dropAllTables = require('./core/database/management/dropAllTables.js');
var createTables = require('./core/database/management/createTables.js');
var hardCodedSensors = require("./core/server/hardCodedSensors.js");

// wait database to be created 
var interval = setInterval(function(){
    console.log("checking for connection.");

    databaseClientP.then(function(){
        clearInterval(interval);

        dropAllTables()
            .catch(function(err){
                console.error("Couldn't drop tables", err);
                throw err;
            })
            .then(createTables)
            .catch(function(err){
                console.error("Couldn't create tables", err);
                throw err;
            })
            .then(function(){   
                if (!process.env.BACKUP) {
                    console.log('no backup file');
                    generateDefinitions()
                        .then(function(){
                            console.log("Dropped and created the tables.")
                            hardCodedSensors();
                        })
                        .catch(function(err){
                            console.error("Couldn't write the schema", err);
                        });
                }
                else {
                    generateDefinitions()
                        .then(console.log('definitions generated'))
                        .catch(function(err){
                            console.error("Couldn't write the schema", err);
                        });
                }
            });
        })
        .catch(function(err){
            console.error("Couldn't connect tables", err);
        });

}, 1000);