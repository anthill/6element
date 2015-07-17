'use strict';

var React = require('react');
var sameHours = require('./sameHours.js');
var formatDay = require('./formatDay.js');

module.exports = function(week, schedule){
    
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
                days = day;
            }
               
            //Check if it's open tomorrow and if opening hours are the same 
            if (schedule.hasOwnProperty(index+1) && sameHours(schedule[index], schedule[index+1])){
                breakDay = false;
            }
            
            else {
                if(!breakDay) days += " - "+ day
                hours = formatDay(schedule[index]);
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
        
};