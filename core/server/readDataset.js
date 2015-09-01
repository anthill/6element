"use strict";

var fs = require('fs');

// remove accents from a String
function removeAccents(strAccents) {
    strAccents = strAccents.split('');
    var strAccentsOut = [];
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) !== -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
}

// parse a .csv and return an array of objects
function parseCSVSync(csv, format, callback) {
    var file = csv.toString().split('\n');
    var _format = file.shift().split(';');
    if (format)
        _format = format;
    var objArray = file.map(function (line) {
        if (line.length === 0)
            return null;
        var i = 0;
        var obj = {};
        line.split(';').forEach(function (field) {
            obj[(_format[i]).toString()] = field;
            ++i;
        })
        return obj;
    })
    if (callback && typeof (callback) === "function")
        return callback(null, objArray);
    return objArray;
}

// return the whole dataset as an array of objects like this: [{place, date}, {place, date}]
function readDataset() {
    return new Promise(function (resolve, reject) {
        fs.readFile('/6element/data/all_data.csv', function (err, file) {
            if (err) {
                reject(err);
                return false;
            }

            console.log('file', file)
            var dataset = parseCSVSync(file, ['place', 'date', 'who', 'what', 'quantity', 'unit', 'md5'])
            .map(function (object) {
                if (object)
                    return {place: object.place.replace('ST ', 'Saint-').toLowerCase(), date: new Date(object.date), md5: object.md5};
                else
                    return (null);
            });
            resolve(dataset);
        })
    });
}

module.exports = {removeAccents: removeAccents, parseCSVSync: parseCSVSync, readDataset: readDataset};
