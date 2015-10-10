"use strict";

require('es6-shim');

var path = require('path');
var fs   = require('fs');
var hstore = require('pg-hstore')();
var Utils = require("./utils.js");
var Places = require('./database/models/places.js');
var placesDeclaration = require('./database/management/declarations.js').places;

var fileToObjects = function(dir, file){

    return new Promise(function(resolve, reject){

        fs.readFile(path.join(dir,file), 'utf8', function (err, data) {
          
            if ( err !== null ) {
                console.log("ERROR in file ", file, '', err);
                reject(err);
            }


            var doc = JSON.parse(data);
            console.log(file, ":", Object.keys(doc).length, 'objecs to save');

            var objectsTosave = Object.keys(doc).map(function(key){

                var toSave = doc[key].properties;
                toSave.lat = doc[key].geometry.coordinates.lat;
                toSave.lon = doc[key].geometry.coordinates.lon;
                toSave.geom = 'POINT(' + toSave.lon + ' ' + toSave.lat + ')';
                
                
                hstore.stringify(toSave.objects, function(result) {
                    toSave.objects = result;
                });

                var filteredObject = {};
                placesDeclaration
                    .columns.map(function(obj){return obj.name})
                    .filter(function(name){return ['created_at', 'updated_at', 'id'].indexOf(name) === -1})
                    .forEach(function(name){
                        filteredObject[name] = toSave[name];
                    })


                // console.log(toSave)
                return filteredObject;
            })
            .filter(function(obj){
                return obj.lat != null && obj.lon != null;
            });

            Places.createByChunk(objectsTosave)
            .then(function(data){
                console.log("Entries saved ", data.length);
                resolve();
            })
            .catch(function(error){
                console.log('error in place chunk creation', error);
            });
            
                        
        });
    });
}



   
var dir = path.join(__dirname,'../data/');
var files = fs.readdirSync(dir);


Promise.all(
    files
    .filter(function(file){
      return (path.extname(file) === '.json'); 
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

