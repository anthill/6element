"use strict";

var connectToDB = require('./connectToDB');

console.log('Connection to DB');

module.exports = connectToDB();
