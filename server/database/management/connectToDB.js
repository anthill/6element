'use strict';

var pg = require('pg');
var PRIVATE = require('../../../PRIVATE.json');
var conString = 'postgres://'+ PRIVATE.pg_user + ':' + PRIVATE.pg_pwd + '@localhost:5432/' + PRIVATE.db_name;

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
                        console.error('Couldn\'t connect to db', conString, err);
                        if(attempts >= MAX_ATTEMPTS)
                            reject('Couldn\'t connect: ' + err); 
                        else {
                            // wait twice more to give time and not overwhelm the database with useless attempts to connect
                            console.warn('Retrying in ', 2*time);
                            tryConnect(2*time); 
                        }
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
