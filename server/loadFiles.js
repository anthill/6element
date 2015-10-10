"use strict";

require('es6-shim');

var path = require('path');
var fs   = require('fs');
var hstore = require('pg-hstore')();
var Utils = require("./utils.js");
var Places = require('./database/models/places.js')

var fileToObjects = function(dir, file){

    return new Promise(function(resolve, reject){

        fs.readFile(path.join(dir,file), 'utf8', function (err, data) {
          
            if ( err !== null ) {
                console.log("ERROR in file ", file, '', err);
                reject(err);
            }


            var doc = JSON.parse(data);
            console.log(file, ":", Object.keys(doc).length, 'objecs to save');

            Promise.all(Object.keys(doc).map(function(key){

                var toSave = doc[key].properties;
                toSave.lat = doc[key].geometry.coordinates.lat;
                toSave.lon = doc[key].geometry.coordinates.lon;
                
                
                hstore.stringify(toSave.objects, function(result) {
                    toSave.objects = result;
                });
                // console.log(toSave)

                return Places.create(toSave)
                .then(function(data){
                    // console.log('Place created', data);
                })
                .catch(function(error){
                    console.log('error in place creation', error);
                });
            }))
            .then(function(){
                resolve();
            })
            
                        
        });
    });
}



   
var dir = path.join(__dirname,'../data/');
var files = fs.readdirSync(dir);


Promise.all(
    files
    .filter(function(file){
      return (file === 'dechetterie_gironde.json'); 
    })
    .map(function(file){
        return fileToObjects(dir, file)
        .then(function(){

        })
        .catch(function(err){
            console.log(err);
        });
    })
)
.then(function(){
    console.log('completed');
    process.exit();
})
.catch(function(err){
    console.log(err);
});

