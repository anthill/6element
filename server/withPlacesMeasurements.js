"use strict";

var request = require('request');


function allResolved(promises){    
    if(!Array.isArray(promises))
        throw new TypeError('promises is not an array');
            
    var actuallyPromises = promises.map(function(v){
        return Promise.resolve(v);
    });
    
    return Promise.all(actuallyPromises.map(function(p){        
        return p.then(function(res){
                return res;
            })
            .catch(function(error){
                console.log("Error in allResolved: ", error)
                return undefined; // move to "resolve channel"
            });
    }));   
}

module.exports = function(list){

    return allResolved(

        list.map(function(object){

            return new Promise(function(resolve, reject){
                
                request({
                    method: 'GET',
                    url:'https://pheromon.ants.builders/placeLatestMeasurement/'+object.pheromon_id+'/wifi', 
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }, function(error, response, body){
                    if (!error) {
                        if(response !== undefined  && body !== "" && response.statusCode < 400){
                            try {
                                var json = JSON.parse(body);
                                resolve(json);
                            } catch(e) {
                                reject("Cannot parse body in withPlaceMeasurements: ", e);
                            }  
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
