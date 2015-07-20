"use strict";

var pg = require('pg');

var conString = process.env.POSTGRES_CONSTRING;
		
module.exports = function(){
    return new Promise(function(resolve, reject){
		console.log('conString', conString);
		var client = new pg.Client(conString);
        client.connect(function(err) {
            if(err) reject(err); else resolve(client);
        });
        
    });
};
