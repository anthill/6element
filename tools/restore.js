#!/usr/bin/env node

"use strict";

require('es6-shim');

var child_process = require('child_process');
var fs = require('fs')
var spawn = child_process.spawn;
var zlib = require('zlib');

var connectToDB = require('../server/database/management/connectToDB.js');
var dropAllTables = require('../server/database/management/dropAllTables.js');

var inputFile = process.argv[2];

connectToDB()
.then(function(){
    return dropAllTables()
    .catch(function(err){
        console.error("Couldn't drop tables", err);
        process.exit();
    })
    .then(function(){
        console.log("Loading the data");
        if (inputFile.includes("gz")) {
            console.log("Gz format")
            var gzip = zlib.createGunzip();
            var readStream = fs.createReadStream(inputFile);
            var proc = spawn('psql', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-d', process.env.POSTGRES_USER]);
            
            return new Promise(function(resolve, reject){
                readStream
                    .pipe(gzip)
                    .pipe(proc.stdin)
                    .on('finish', function() {
                        resolve();
                    })
                    .on('error', function(error) {
                        reject(error);
                    })
            });
        }
        else
            spawn('psql', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-w', '-f', inputFile]);
    })
    .catch(function(err){
        console.error("Couldn't load the data", err);
        process.exit();
    })
    .then(function(){
        console.log("Success!");
        process.exit();
    })
})
.catch(function(err){
    console.error("Couldn't connect to database", err);
});
