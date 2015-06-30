'use strict';

function formatHour(hour){
    //has to be a string and length=4
    return hour.slice(0,2) + ":" + hour.slice(2,4);
}


function formatDay(day){
    //Has to be a list composed of 2 similar objects 
    // If RC doesn't close for lunch the closing time is still in day[2]["end"]. day[1]["end"] and day[2]["start"] are undefined
    var display = formatHour(day[1]["start"]) + " - ";
    if ( formatHour(day[1]["end"]) )
    {
                display+= formatHour(day[1]["end"])  + " / " +
                formatHour(day[2]["start"])  + " - " ;
    }
    display+=formatHour(day[2]["end"]) + ".";
    return display;
}

module.exports = {
    formatHour: formatHour,
    formatDay: formatDay
};