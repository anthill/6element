'use strict';

var React = require('react');

var moment = require('moment');
//==============================================================================================================================
// HOUR / DATE FUNCTIONS

function isItOpen(now, schedule){
    //now is an array [dayName, string hhmm]
    //schedule the object given in main.js
    var nowDay = now[0];
    var nowTime = now[1];
    
    schedule.forEach(function(day){ 
        var scheduleDay = day[0]
        var morning = day[1];
        var afternoon = day[2];
        
        isBetweenHours 
        
        var isClosed = (now > closedTime) ;
        
        if (isClosed && isTuesday && isHolidays)
        
        if (nowDay === scheduleDay && //good day
                ((morning.end && //don't close for lunch
                    ((nowTime > parseInt(morning.end) && nowTime < parseInt(morning.end)) ||
                    (nowTime > parseInt(afternoon.start) && nowTime < parseInt(afternoon.start))) ) ||
                (!morning.end &&
                    (nowTime > parseInt(morning.srart && now[1] < parseInt(afternoon.start))))))
        {
            return true;
        } 
    return false;
    })
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
    var crowdMoment;

    measures.forEach(function(measure, index){
        var inf = Date.parse(measure.date);
        var sup = measures[index+1] ? Date.parse(measures[index+1].date) : undefined;
        
        if (moment >= inf && moment < sup)
            crowdMoment = measure.value;
    });

    return crowdMoment;
}


function levelCalc(maxSize, crowdMoment){
    //Mesure how important the crowd is
    //Depends only on crowd for the moment
    var ratio = parseFloat((crowdMoment / maxSize).toFixed(2)) ;
    var level;
    if (ratio<=0.50){ level = 0; }
    else if(ratio <=0.75) { level = 1; }
    else {level = 2;}
           
    return level;
}
    
function createLine(now, crowd, maxSize){
    
}

function findActual(month, date, hourmin, crowd){
    
}


//##############################################################################################################################
// EXPORT

module.exports = {
    formatHour: formatHour,
    formatDay: formatDay,
    levelCalc : levelCalc,
    isItOpen : isItOpen,
    crowdMoment : crowdMoment
};