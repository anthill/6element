'use strict';

require('es6-shim');

var fs = require('fs');
var path = require('path');
var generateSqlDefinition = require('sql-generate');

var connectToDB = require('./management/connectToDB.js');
var dropAllTables = require('./management/dropAllTables.js');
var createTables = require('./management/createTables.js');


var conString = [
    'postgres://',
    process.env.POSTGRES_USER,
    ':', 
    process.env.POSTGRES_PASSWORD,
    '@',
    process.env.DB_PORT_5432_TCP_ADDR,
    ':',
    process.env.DB_PORT_5432_TCP_PORT,
    '/postgres'
].join('');

console.log('Init-db connection string', conString);

function generateDefinitions() {
    return new Promise(function(resolve, reject) {
        generateSqlDefinition({ dsn: conString, omitComments: true }, function(err, definitions) {
            if (err) {
                console.error(err);
                reject(err);
            }
            fs.writeFileSync(path.join(__dirname, './management/declarations.js'), definitions.buffer);
            resolve();
        });
    });
}

(function tryRebuildDatabase(){
    console.log('Trying to rebuild database...');
    
    setTimeout(function(){
        connectToDB()
        .then(function(){
            dropAllTables()
            .catch(function(err){
                console.error('Couldn\'t drop tables', err);
                process.exit();
            })
            .then(createTables)
            .catch(function(err){
                console.error('Couldn\'t create tables', err);
                process.exit();
            })
            .then(function(){   
                if (!process.env.BACKUP) {
                    console.log('no backup file');
                    generateDefinitions()
                    .then(function(){
                        console.log('Dropped and created the tables.');
                        process.exit();
                    })
                    .catch(function(err){
                        console.error('Couldn\'t write the schema', err);
                        process.exit();
                    });
                }
                else {
                    generateDefinitions()
                    .then(function(){
                        console.log('definitions generated');
                        process.exit();
                    })
                    .catch(function(err){
                        console.error('Couldn\'t write the schema', err);
                        process.exit();
                    });
                }
            })
            .catch(function(){
                tryRebuildDatabase();
            });
        })
        .catch(function(err){
            console.error('Couldn\'t connect tables', err);
            tryRebuildDatabase();
        });
    }, 1000);
})();
