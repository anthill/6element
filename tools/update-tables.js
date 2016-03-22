#!/usr/bin/env node

'use strict';

require('es6-shim');

var connectToDB = require('../server/database/management/connectToDB.js');
var createTables = require('../server/database/management/createTables.js');
var generateDeclarations = require('../server/database/management/generateDecl.js');

connectToDB()
.then(function(db){
    return createTables(db)
})
.then(function(){
    return generateDeclarations();
})
.then(function(){
    console.log('Success!');
    process.exit();
})
.catch(function(err){
    console.error('ERROR ', err);
    process.exit();
});
