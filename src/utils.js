'use strict';

var React = require('react');

var moment = require('moment');
//==============================================================================================================================
// HOUR / DATE FUNCTIONS
function isItOpenOn(day){
    return (day[1].start ? day[1].start : false); 
}
function isItOpenNow(now, schedule){
    //now is an array [dayName, string hhmm]
    //schedule the object given in main.js
    
    var open = false;
    
    var nowDay = now[0];
    var nowTime = now[1];
    
    schedule.forEach(function(day){ 
        var scheduleDay = day[0]
        var morning = day[1];
        var afternoon = day[2];
        
        var closeForLunch = morning.end; 
        var isClosedEvening = nowTime < parseInt(morning.start) && nowTime > parseInt(afternoon.start);
        var isClosedLunch = nowTime > parseInt(morning.end) && nowTime < parseInt(afternoon.start);
        
        if (nowDay === scheduleDay && 
                ((closeForLunch && !isClosedEvening && !isClosedLunch) ||
                (!closeForLunch && !isClosedEvening)))
            open = true; 
        });
    
    
    return open;
}

function isItOpenNow(datetimeObject, schedule){

    
    // check if there is an entry on this day
    var day = datetimeObject.getDay();
    if (!schedule.has(day)
        return false;

    // check if there is an interval containing this hour 
    schedule[day].forEach(function(interval){
        // compute minutes since midnight
        var start = parseInt(interval.start.slice(2)) * 60 + parseInt(interval.start.slice(2,4));
        var end = parseInt(interval.end.slice(2)) * 60 + parseInt(interval.end.slice(2,4));
        var current = datetimeObject.getUTCHours() * 60 + datetimeObject.getMinutes();
        if (current > start && current < end)
            return true;

    });
    return false;
    
}



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

//==============================================================================================================================
// CROWD CALCULATION

function crowdMoment(moment, measures){
    var crowdMoment = {};

    measures.forEach(function(measure, index){
        var inf = Date.parse(measure.date);
        var sup = measures[index+1] ? Date.parse(measures[index+1].date) : undefined;
        
        if (moment >= inf && moment < sup)
            crowdMoment = {date : measure.date,
                           value : measure.value
                          };
    });
    

    return crowdMoment;
}


function levelCalc(maxSize, crowdMoment){
    //Mesure how important the crowd is
    //Depends only on crowd for the moment
    var ratio = parseFloat((crowdMoment / maxSize).toFixed(2)) ;
    var level = [];
    if (ratio<=0.50){ level = 0 ; }
    else if(ratio <=0.75) { level = 1; }
    else {level = 2;}
           
    return level;
}





//##############################################################################################################################
// EXPORT

module.exports = {
    formatHour: formatHour,
    formatDay: formatDay,
    levelCalc : levelCalc,
    isItOpenNow : isItOpenNow,
    isItOpenOn : isItOpenOn,
    crowdMoment : crowdMoment
};