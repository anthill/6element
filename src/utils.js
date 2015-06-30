'use strict';

var React = require('react');

var moment = require('moment');
//==============================================================================================================================
// HOUR / DATE FUNCTIONS

function isItOpen(now, schedule){
    //now is an array [dayName, string hhmm]
    //schedule the object given in main.js
    
    
    for (var day in schedule){
        if (now[0] === schedule[day][0] && //good day
                ((schedule[day][1]["end"] && //don't close for lunch
                    ((now[1] > parseInt(schedule[day][1]["start"]) && now[1] < parseInt(schedule[day][1]["end"])) ||
                    (now[1] > parseInt(schedule[day][2]["start"]) && now[1] < parseInt(schedule[day][2]["end"]))) ) ||
                (schedule[day][1]["end"] === undefined &&
                    (now[1] > parseInt(schedule[day][1]["start"] && now[1] < parseInt(schedule[day][2]["end"]))))))
        {
            return true;
        } 
    }
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

function crowdMoment(now, crowd){
    var crowdNow;
    for (var gap in crowd){
        if (now.toISOString()>=crowd[gap]["date"] && (crowd[gap+1] && now.toISOString()<crowd[gap+1]["date"])){
            crowdNow = crowd[gap]["mesure"];
        }
    }
    
    return crowdNow;
}
function levelCalc(maxSize, crowdMoment) {
    //Mesure how important the crowd is
    //Depends only on crowd for the moment
    var ratio = parseFloat((crowdMoment / maxSize).toFixed(2)) ;
    var level;
    if (ratio>0.50){ level = "<5mn"; }
    else if(ratio <=0.70) { level = "<15mn"; }
    else {level = ">15mn";}
            
    return level;
}
    
function createLine(now, crowd, maxSize){
    
}

function findActual(month, date, hourmin, crowd){
    
}

/*function generateTable(schedule){
    var now= new Date();
    var day = now.getDay();
    var beginingHour = parseInt(schedule[day][1]["start"])/100;
    var beginingMin = parseInt(schedule[day][1]["start"])%100;
    var endingHour = parseInt(schedule[day][2]["end"])/100;
    var endingMin = parseInt(schedule[day][1]["end"])%100;
    
    var date = moment(year : now.getFullYear(), month : now.getMonth() , day : now.getDate(),
                    hour : beginingHour, minute : beginingMin);
    */

//##############################################################################################################################
// EXPORT

module.exports = {
    formatHour: formatHour,
    formatDay: formatDay,
    levelCal : levelCalc,
    isItOpen : isItOpen,
    crowdMoment : crowdMoment
};