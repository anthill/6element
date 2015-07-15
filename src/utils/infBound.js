
'use strict';

var React = require('react');
var moment = require('moment');

function infBound(datetimeObject){

    var hourMoment = datetimeObject.hours();
    var minMoment = datetimeObject.minutes();

    var inf = moment().utc().set({        
        hour : hourMoment,
        minute : minMoment - minMoment%15,
        second : 0,
        millisecond : 0
    });
    
    return inf.toISOString();
}

module.exports = {
    infBound : infBound
};