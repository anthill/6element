'use strict';

var React = require('react');
var moment = require('moment');
var getDayNumber = require('./utils.js').getDayNumber;
var getHoursString = require('./utils.js').getHoursString;
var getMinutesString = require('./utils.js').getMinutesString;



module.exports = function(datetimeObject, schedule){

    var day = getDayNumber(datetimeObject);
    var open = false;
    
    if (!(schedule.hasOwnProperty(day)))
        return false;
    
    // check if there is an interval containing this hour 
    schedule[day].forEach(function(interval){
        // compute minutes since midnight
        var start = getHoursString(interval.start) * 60 + getMinutesString(interval.start);
        var end = getHoursString(interval.end) * 60 + getMinutesString(interval.end) ;
        var current = datetimeObject.hours() * 60 + datetimeObject.minutes();
        
        if (current >= start && current <= end) {
            open =  true;
            return open;
        }

    });
    return open;   
}
