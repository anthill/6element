'use strict';

var React = require('react');

var moment = require('moment');
//==============================================================================================================================
// HOUR / DATE FUNCTIONS

function isItOpen(datetimeObject, schedule){

    
    // check if there is an entry on this day
    var day = numDay(datetimeObject);
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

function getHoursString(timeString) {return parseInt(timeString.slice(0,2));}

function getMinutesString(timeString) {return parseInt(timeString.slice(2,4));}

function displaySchedule(week, schedule){
    
    var breakDay = true;
    var days = "";
    var hours = "";
    var div ; 
    var divs = [];
    
    
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
                days += day;
                hours = formatDay(schedule[index])
                div = React.DOM.dl({className : "row"},
                    React.DOM.dt({className : "col-lg-2"}, days, " : " ),
                    React.DOM.dd({className : "col-lg-3"}, hours));
                divs.push(div);
                breakDay = true;
            }
        }
        else {
            days = day;
            hours = "fermé";
            div = React.DOM.dl({className : "row"},
                React.DOM.dt({className : "col-lg-2"}, days, " : " ),
                React.DOM.dd({className : "col-lg-3"}, hours));
            divs.push(div)
        }
    });
    
    return divs;
        
}

function sameHours(d1,d2){
    //don't compare each values if both list are not the same length
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
    var numDay = datetimeObject.day()-1;
    if (numDay === -1)
        numDay = 6;
    return numDay;
}
    
function formatHour(hour, now){
    //has to be a string and length=4 or 3
    
    now = new Date();
    var localHour = (parseInt(hour) - (now.getTimezoneOffset()/60 * 100)).toString();
    return localHour.slice(0,localHour.length-2) + ":" + localHour.slice(localHour.length-2);
}


function formatDay(scheduleDay){
    //Each day in schedule Has to be a list composed with similar objects  {start : , end : }
    var div = "";
    var divs = []; 
    
    scheduleDay.forEach(function(gap){
        div = formatHour(gap.start) + " - " + formatHour(gap.end);
        divs.push(div);
    });

    return divs;
}

//==============================================================================================================================
// CROWD CALCULATION

function infBound(datetimeObject){
    
    //inf bound
    var hourMoment = datetimeObject.hours();
    var minMoment = datetimeObject.minutes();
    /*var inf = moment.sets({
        hour : hourMoment,
        minute : minMoment - minMoment%15,
        seconde : 0
    });*/
    var inf = moment().utc().set({        
        hour : hourMoment,
        minute : minMoment - minMoment%15,
        second : 0,
        millisecond : 0
    });
    return inf.toISOString();
}


function levelCalc(maxSize, crowdMoment){
    
    var ratio = parseFloat((crowdMoment / maxSize).toFixed(2)) ;
    var level;
    
    if (ratio <= 0.50){ level = 0 ; }
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
    infBound : infBound,
    displaySchedule : displaySchedule,
    getHoursString : getHoursString,
    getMinutesString : getMinutesString,
    numDay : numDay
};
