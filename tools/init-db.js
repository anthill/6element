"use strict";

require('es6-shim');

var fs = require('fs');
var path = require('path');

var generateSqlDefinition = require('sql-generate');

// when ready, drop and create tables
var databaseClientP = require('../core/database/management/databaseClientP');

var dropAllTables = require('../core/database/management/dropAllTables.js');
var createTables = require('../core/database/management/createTables.js');
var hardCodedSensors = require("../core/server/hardCodedSensors.js");


var conString = [
    "postgres://",
    process.env.POSTGRES_USER,
    ":", 
    process.env.POSTGRES_PASSWORD,
    "@",
    process.env.DB_PORT_5432_TCP_ADDR,
    ":",
    process.env.DB_PORT_5432_TCP_PORT,
    "/postgres"
].join('');

console.log('Init-db connection string', conString);
// postgres://postgres:elements@172.17.0.90:5432/postgres
// postgres://postgres:elements@172.17.0.90:5432/postgres

function generateDefinitions() {
    return new Promise(function(resolve, reject) {
        generateSqlDefinition({ dsn: conString, omitComments: true }, function(err, definitions) {
            if (err) {
                console.error(err);
                reject(err);
            }
            fs.writeFileSync(path.join(__dirname, "../core/database/management/declarations.js"), definitions.buffer);
            resolve();
        });
    });
}


// wait database to be created 


(function tryRebuildDatabase(){
    console.log("Trying to rebuild database...");
    
    setTimeout(function(){
        databaseClientP.then(function(){
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
                })
                .catch(function(err){
                    tryRebuildDatabase()
                })
            })
            .catch(function(err){
                console.error("Couldn't connect tables", err);
                tryRebuildDatabase();
            });
    }, 1000);
})()
