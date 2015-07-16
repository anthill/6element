
'use strict';

var React = require('react');
var moment = require('moment');

module.exports = function(datetimeObject){

    var hourMoment = datetimeObject.hours();
    var minMoment = datetimeObject.minutes();

    var inf = moment().utc().set({        
        hour : hourMoment,
        minute : minMoment - minMoment%15,
        second : 0,
        millisecond : 0
    });
    
    return inf.toISOString();
};