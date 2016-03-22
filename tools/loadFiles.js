'use strict';

require('es6-shim');

var path = require('path');
var fs   = require('fs');
var hstore = require('pg-hstore')();
var Places = require('../server/database/models/places.js');
var Networks = require('../server/database/models/networks.js');
var placesDeclaration = require('../server/database/management/declarations.js').places;

var CREATE_CHUNK_SIZE = 1000;

function createPlacesByChunk(entries){
    return entries.length === 0 ? undefined : Places.create(entries.slice(0, CREATE_CHUNK_SIZE))
        .then(function(){
            return createPlacesByChunk(entries.slice(CREATE_CHUNK_SIZE));
        });
}

function fileToObjects(dir, file, networks){

    return new Promise(function(resolve, reject){
        var sources = {};
        networks.forEach(function(network){

            network.sources.forEach(function(source){
                sources[source] = network.id;
            });
        });

        var filepath = path.join(dir,file);
        fs.readFile(filepath, 'utf8', function (err, data) {
          
            if ( err !== null ) {
                console.log('ERROR in file ', file, '', err);
                reject(err);
            }

            (function timeout(){
                Places.count()
                .then(function(count){
                    console.log(count, 'places in database');
                })
                .catch(function(e){
                    console.error('count error', e);
                })
                .then(function(){
                    setTimeout(timeout, 5*1000);
                });
            })();
            
            
            
            var doc = JSON.parse(data);

            console.log(data.length);
          
            var placesData = Object.keys(doc).map(function(key){

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
                });
                hstore.stringify(wastes, function(result) {
                    toSave.objects = result;
                });
                
                var filteredObject = {};
                placesDeclaration
                    .columns.map(function(obj){return obj.name;})
                    .filter(function(name){return ['created_at', 'updated_at', 'id'].indexOf(name) === -1;})
                    .forEach(function(name){
                        filteredObject[name] = toSave[name];
                    });

                return filteredObject;
         
            })
            .filter(function(obj){
                return typeof obj.lat === 'number' && typeof obj.lon === 'number';
            });

            console.log('Ready to insert', placesData.length, 'places in database');
            
            createPlacesByChunk(placesData)
            .then(function(){
                resolve();
            })
            .catch(function(error){
                console.log('error in place chunk creation', error);
            });
            
                        
        });
    });
}



   
var dir = path.join(__dirname,'../data/');

Networks.getAll()
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

