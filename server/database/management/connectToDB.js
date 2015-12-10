'use strict';

var pg = require('pg');

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

console.log('conString', conString);

var MAX_ATTEMPTS = 10;
var INITIAL_TIMEOUT_TIME = 100;

module.exports = function(){
    var attempts = 0;
    
    return new Promise(function(resolve, reject){
        
        (function tryConnect(time){
            setTimeout(function(){
                
                var client = new pg.Client(conString);

                client.connect(function(err) {
                    if(err){
                        if(attempts >= MAX_ATTEMPTS)
                            reject(err); 
                        else
                            // wait twice more to give time and not overwhelm the database with useless attempts to connect
                            tryConnect(2*time); 
                    }
                    else{
                        resolve(client);
                    }
                    
                    attempts++;
                });

            }, time);
        })(INITIAL_TIMEOUT_TIME);
        
    });
};
