"use strict";

var pg = require('pg');

var conString = "postgres://postgres:" + process.env.POSTGRES_PASSWORD + "@" + process.env.DB_PORT_5432_TCP_ADDR + ":5432/postgres";
		
module.exports = function(){
    return new Promise(function(resolve, reject){
		console.log('conString', conString);
		var client = new pg.Client(conString);
        client.connect(function(err) {
            if(err) reject(err); else resolve(client);
        });
        
    });
};
