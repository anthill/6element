'use strict';

var fs = require('fs');
var path = require('path');
var Categories = require('../server/database/models/categories');

var catFile = '../data/recycling_types.json';

fs.readFile(path.join(catFile), 'utf8', function (err, data) {
  
    if ( err !== null ) {
        console.log('ERROR in file ', file, '', err);
        process.exit();
    }

    var categories = JSON.parse(data);

    Categories.createByChunk(categories)
    .then(function(entries){
        console.log('Categories loaded ', entries.length);
        process.exit();
    })
    .catch(function(error){
        console.log('Error in loading Categories');
        process.exit();
    });   
});

