"use strict";

var fs = require('fs');
var zlib = require('zlib');
var spawn = require('child_process').spawn;

var databaseP = require('./databaseClientP');

module.exports = function(){
    return new Promise(function(resolve, reject){
        databaseP
    	.then(function(db){
    		var sqlFile;
			if (process.env.BACKUP){
				// if a environement variable is set, use it to load some data
				console.log("== A dump file is specified, loading the data. ==");
				sqlFile = '/6element/app/data/' + process.env.BACKUP;
				var gzip = zlib.createGunzip();
				var readStream = fs.createReadStream(sqlFile);
				var proc = spawn('psql', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-d', process.env.POSTGRES_USER]);
				readStream
					.pipe(gzip)
					.pipe(proc.stdin);

				readStream.on("close", function(){
					resolve();
				})
			} else {
				console.log("== Resetting the database ==")
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
