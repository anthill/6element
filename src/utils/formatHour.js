'use strict';

var React = require('react');

function formatHour(hour){
    //has to be a string and length=4 or 3
    
    now = new Date();
    var localHour = (parseInt(hour) - (now.getTimezoneOffset()/60 * 100)).toString();
    
    return localHour.slice(0,localHour.length-2) + ":" + localHour.slice(localHour.length-2);
}

module.exports = {
    formatHour: formatHour
};