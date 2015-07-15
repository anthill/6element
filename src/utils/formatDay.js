'use strict';

var React = require('react');
var formatHour = require('formatHour.js')

function formatDay(scheduleDay){
    //Each day in schedule has to be a list composed with similar objects  {start : , end : }
    var div = "";
    var divs = []; 
    
    scheduleDay.forEach(function(gap){
        div = formatHour(gap.start) + " - " + formatHour(gap.end);
        divs.push(div);
    });

    return divs;
}

module.exports = {
    formatDay: formatDay
};