"use strict";

require('es6-shim');

var path = require('path');
var fs   = require('fs');
var hstore = require('pg-hstore')();
var Places = require('./database/models/places.js');
var Networks = require('./database/models/networks.js');
var placesDeclaration = require('./database/management/declarations.js').places;

function fileToNetworks(dir, file){
    
    return new Promise(function(resolve, reject){

        fs.readFile(path.join(dir,file), 'utf8', function (err, data) {
          
            if ( err !== null ) {
                console.log("ERROR in file ", file, '', err);
                reject(err);
            }

            var networks = JSON.parse(data);

            Networks.createByChunk(networks)
            .then(function(entries){
                console.log("Entries saved ", entries.length);
                resolve(entries);
            })
            .catch(function(error){
                console.log('error in network chunk creation', error);
            });   
        });
    });
}

function fileToObjects(dir, file, networks){

    return new Promise(function(resolve, reject){
        var sources = {};
        networks.forEach(function(network){
            network[0].sources.forEach(function(source){
                sources[source] = network[0].id;
            });
        });

        fs.readFile(path.join(dir,file), 'utf8', function (err, data) {
          
            if ( err !== null ) {
                console.log("ERROR in file ", file, '', err);
                reject(err);
            }

            var doc = JSON.parse(data);
            var objectsTosave = Object.keys(doc).map(function(key){

                var toSave = doc[key].properties;
                toSave.lat = doc[key].geometry.coordinates.lat;
                toSave.lon = doc[key].geometry.coordinates.lon;
                toSave.geom = 'POINT(' + toSave.lon + ' ' + toSave.lat + ')';
                toSave.network = sources[toSave.source];
                if(typeof toSave.network === 'undefined')
                    console.log('error network', toSave.source);
               
                var wastes = {};
                Object.keys(toSave.objects).filter(function(k){
                    return toSave.objects[k] === 1;
                })
                .forEach(function(k){
                    wastes[k] = toSave.objects[k];
                })
                hstore.stringify(wastes, function(result) {
                    toSave.objects = result;
                });

                if(toSave.bins !== undefined){
                    var bins = {};
                    Object.keys(toSave.bins)
                    .forEach(function(k){
                        bins[k] = toSave.bins[k];
                    })
                    hstore.stringify(bins, function(result) {
                        toSave.bins = result;
                    });    
                }
                
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
                return typeof obj.lat === 'number' && typeof obj.lon === 'number';
            });

            Places.createByChunk(objectsTosave)
            .then(function(entries){
                console.log("Entries saved ", entries.length);
                resolve();
            })
            .catch(function(error){
                console.log('error in place chunk creation', error);
            });
            
                        
        });
    });
}



   
var dir = path.join(__dirname,'../data/');

fileToNetworks(dir, 'networks.json')
.then(function(networks){
    return fileToObjects(dir, 'places.json', networks)
    .then(function(){
        console.log('completed');
        process.exit();
    })
    .catch(function(err){
        console.log('places:', err);
    });
})
.catch(function(err){
    console.log('networks:', err);
});

