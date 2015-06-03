"use strict";

var pg = require('pg');
var boot2dockerIp = require('../../utils/boot2dockerIp')

var conStringP = 
	boot2dockerIp()
		.then(function(ip){
			return "postgres://postgres:password@" + ip + ":6000/postgres";
		})
		.catch(function(error){
			return "postgres://postgres:password@localhost:6000/postgres";
		});


module.exports = function(){
    return new Promise(function(resolve, reject){
    	conStringP.then(function(conString){
    		console.log('conString', conString);
    		var client = new pg.Client(conString);
	        client.connect(function(err) {
	            if(err) reject(err); else resolve(client);
	        });
    	});
        
    });
};
