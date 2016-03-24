'use strict';

var path = require('path');
var fs   = require('fs');

var makeMap = require('./makeMap');

var Places = require('../server/database/models/places.js');
var placesDeclaration = require('../server/database/management/declarations.js').places;

var categories = require('../references/categories.json');
var synonymMap = makeMap(require('../references/synonyms.json'));

var invCatMap = new Map();

var CREATE_CHUNK_SIZE = 1000;

// Build inverted categories Map
categories.forEach(function(category){
    category.objects.forEach(function(subCategory){
        invCatMap.set(subCategory, category.name);
    });
});

function createPlacesByChunk(entries){
    // console.log('Entries size', entries.length);
    return entries.length === 0 ? undefined : Places.create(entries.slice(0, CREATE_CHUNK_SIZE))
        .then(function(){
            return createPlacesByChunk(entries.slice(CREATE_CHUNK_SIZE));
        });
}

function readDir(dir){
    return new Promise(function(resolve, reject){
        fs.readdir(dir, function(err, files){
            if (err)
                reject('ERR: ' + err);

            else
                resolve(files);
        });
    });
}

var count = 0;

function processFile(dir, file){
    return new Promise(function(resolve, reject){
        fs.readFile(path.join(dir, file), function(err, data){
            if (err)
                reject('Couldn\'t read file:' + file + ': ' + err);
            else {
                var points = JSON.parse(data);
                console.log('Processing', file, ':', Object.keys(points).length, 'points');
                count += Object.keys(points).length;

                var leRelais = 0;

                var newPoints = [];

                Object.keys(points).map(function(key){
                    var prop = points[key].properties;

                    var lat = points[key].geometry.coordinates.lat || points[key].geometry.coordinates[1];
                    var lon = points[key].geometry.coordinates.lon || points[key].geometry.coordinates[0];

                    var isLaFibreLeRelais = (file === 'lafibredutrie.json' && prop.owner.match(/^Le Relais/))
                    var isRC = prop.name.match(/^dechet/i) || prop.name.match(/^déchèt/i);
                    var hasCoords = lat && lon;

                    if (!isLaFibreLeRelais && !isRC && hasCoords){
                        var pointCategories = new Map();

                        Object.keys(prop.objects).forEach(function(object){
                            var mainCat = invCatMap.get(object);

                            if (synonymMap.has(object)){ // check for synonyms
                                console.log('SYNONYM', object, synonymMap.get(object));
                                object = synonymMap.get(object);
                            }

                            if (pointCategories.has(object))
                                pointCategories.get(mainCat).push(object);
                            else
                                pointCategories.set(mainCat, [object]);
                        });

                        var bins = [];
                        pointCategories.forEach(function(subCat, cat){
                            bins.push({
                                t: cat,
                                a: true,
                                o: subCat
                            });
                        });

                        newPoints.push({
                            name: prop.name,
                            operator: prop.owner,
                            source: prop.owner,
                            source_url: prop.source,
                            type: prop.type,
                            website: prop.website,
                            phone: prop.phone,
                            address_1: prop.adress_1,
                            address_2: prop.adress_2,
                            public_access: prop.public_access,
                            pro_access: prop.pro_access,
                            bins: bins,
                            lat: lat,
                            lon: lon,
                            geom: 'POINT(' + lon + ' ' + lat + ')'
                        });
                    }
                });

                resolve(newPoints);
            }
        });
    });
}

var doNotProcess = new Set([
    'osm_dechetteries.json',
    'déchetterie_gironde.json'
]);

readDir(__dirname + '/../data/point_ref/')
.then(function(files){
    var processedP = files.map(function(file){
        if (!doNotProcess.has(file))
            return processFile(__dirname + '/../data/point_ref/', file)
            .then(function(data){
                console.log('File', file, 'processed:', data.length);
                return data;
            });
    });

    return Promise.all(processedP);
})
.then(function(allData){
    console.log('All files processed');
    var flattenedData = allData.reduce(function(a, b){
        return a.concat(b);
    });
    console.log('flattenedData', flattenedData.length);
    return flattenedData;
})
.then(function(flatData){
    return createPlacesByChunk(flatData); 
})
.then(function(){
    console.log('Data stored into DB');
    process.exit();
})
.catch(function(err){
    console.log('ERROR', err);
    process.exit()
});
