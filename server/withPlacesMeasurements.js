"use strict";

var request = require('request');

module.exports = function(list){

    return Promise.all(

        list.map(function(object){

            return new Promise(function(resolve, reject){
                
                request({
                    method: 'GET',
                    url:'https://pheromon.ants.builders/placeLatestMeasurement/'+object.pheromon_id+'/wifi', 
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }, function(error, response, body){
                    if (!error) {
                        if(response !== undefined &&
                            response.statusCode < 400){
                            resolve(JSON.parse(body));
                        } else {
                            reject(Object.assign(
                                new Error('HTTP error because of bad status code ' + body),
                                {
                                    HTTPstatus: typeof response === 'undefined'?'':response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                        }
                    }
                    else {
                        console.log('ici');
                        reject(Object.assign(
                                new Error('HTTP error'),
                                {
                                    HTTPstatus: typeof response === 'undefined'?'':response.statusCode,
                                    text: body,
                                    error: error
                                }
                            ));
                    }
                });
            })
        })
    );  
}