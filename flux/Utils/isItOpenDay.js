'use strict';

var getDayNumber = require('./utils.js').getDayNumber;
var getHoursString = require('./utils.js').getHoursString;
var getMinutesString = require('./utils.js').getMinutesString;



module.exports = function(datetimeObject, schedule){
    var day = getDayNumber(datetimeObject);
    
    if (!(schedule.hasOwnProperty(day)))
        return false;
    
    // check if there is an interval containing this hour 
    // compute minutes since midnight
    var start = getHoursString(schedule[0].start) * 60 + getMinutesString(schedule[0].start);
    var end = getHoursString(schedule[schedule.length-1].end) * 60 + getMinutesString(schedule[schedule.length-1].end);
    var current = datetimeObject.hours() * 60 + datetimeObject.minutes();

    if (current >= start && current <= end) {
        return true;
    }


    return false;   
}
