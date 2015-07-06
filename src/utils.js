'use strict';

var React = require('react');

var moment = require('moment');
//==============================================================================================================================
// HOUR / DATE FUNCTIONS

/*function isItOpen(now, schedule){
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
}*/

function isItOpen(datetimeObject, schedule){

    
    // check if there is an entry on this day
    var day = numDay(datetimeObject);
    var open = false;
    if (!(schedule.hasOwnProperty(day)))
        return false;
    
    // check if there is an interval containing this hour 
    schedule[day].forEach(function(interval){
        // compute minutes since midnight
        var start = parseInt(interval.start.slice(0,2)) * 60 + parseInt(interval.start.slice(2,4));
        var end = parseInt(interval.end.slice(0,2)) * 60 + parseInt(interval.end.slice(2,4));
        var current = datetimeObject.getUTCHours() * 60 + datetimeObject.getMinutes();
        
        /*console.log(interval.start.slice(0,2));
        console.log('start', start);
        console.log('end', end);
        console.log('current', current);*/
        
        if (current > start && current < end)
            open =  true;
            return open;

    });
    return open;
    
}

function displaySchedule(week, schedule){
    var breakDay = true;
    var days = "";
    
    week.forEach(function(day, index){
        // Check if it's open today
        
        if (schedule.hasOwnProperty(index))
        {  
            if (breakDay) {
                days += day + " - ";
            }
               
            //Check if it's open tomorrow and if opening hours are the same 
            if (schedule.hasOwnProperty(index+1) && sameHours(schedule[index], schedule[index+1])){
                breakDay = false;
            }
            
            else {
                days += day + " : " + formatDay(schedule[index]) + "\n";
                breakDay = true;
            }
        }
        else
            days += day + " : fermé \n";                    
    });
    
    return days;
        
}

function sameHours(d1,d2){
    if (d1.length !== d2.length) 
        return false;
    
    else{
        d1.forEach(function(session, index){
            if (session.start !== d2[index].start ||
                !session.end !== d2[index].end)
                return false;
        });
    }
    return true;
        
}
function numDay(datetimeObject){
    var numDay = datetimeObject.getDay()-1;
    if (numDay === -1)
        numDay = 6;
    return numDay;
}
    
function formatHour(hour){
    //has to be a string and length=4
    return hour.slice(0,2) + ":" + hour.slice(2,4);
}


function formatDay(scheduleDay){
    //Each day in schedule Has to be a list composed with similar objects  {start : , end : }
    // If RC doesn't close for lunch the closing time is still in day[2]["end"]. day[1]["end"] and day[2]["start"] are undefined
    var display = formatHour(scheduleDay[0].start) + " - ";
    if ( formatHour(scheduleDay[0].end) )
    {
                display+= formatHour(scheduleDay[0].end)  + " / " +
                formatHour(scheduleDay[1].start)  + " - " ;
    }
    display+=formatHour(scheduleDay[1].end) + ".";
    return display;
}

//==============================================================================================================================
// CROWD CALCULATION

function crowdMoment(moment, measures, schedule){
    var crowdMoment = {};

    measures.forEach(function(measure, index){
        var inf = new Date(measure.date);
        //check if it's theorically and practically open 
        var sup = (isItOpen(moment, schedule) && measures[index+1]) ? new Date(measures[index+1].date) : undefined;
        
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
    isItOpen : isItOpen,
    crowdMoment : crowdMoment,
    displaySchedule : displaySchedule,
    numDay : numDay
};