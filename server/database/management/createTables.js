'use strict';

var fs = require('fs');
var zlib = require('zlib');
var spawn = require('child_process').spawn;

var connectToDB = require('./connectToDB.js');

module.exports = function(){
    return new Promise(function(resolve, reject){
        connectToDB()
        .then(function(db){
            var sqlFile;
            if (process.env.BACKUP){
                // if a environement variable is set, use it to load some data
                console.log('== A dump file is specified, loading the data. ==');
                sqlFile = '/pheromon/data/' + process.env.BACKUP;
                var gzip = zlib.createGunzip();
                var readStream = fs.createReadStream(sqlFile);
                var proc = spawn('psql', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-d', process.env.POSTGRES_USER]);
                readStream
                    .pipe(gzip)
                    .pipe(proc.stdin);

                // This code doesn't work because gzip is too slow
                // readStream.on('close', function(){
                //     resolve();
                // })

                setTimeout(resolve, 3000); // <-- not a beautiful patch, but it works
                
            } else {
                console.log('== Creating the database tables ==');
                var createTableScript = fs.readFileSync( require.resolve('./createTables.sql') ).toString();
                db.query(createTableScript, function(err, result) {
                    if(err) reject(err); else resolve(result);
                });
            }
  
        })
        .catch(function(err){
            console.error('Could not connect', err);
        });
    });
};
