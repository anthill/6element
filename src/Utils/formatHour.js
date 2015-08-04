'use strict';

module.exports = function(hour){
    //has to be a string and length=4 or 3
    
    var now = new Date();
    var localHour = (parseInt(hour) - (now.getTimezoneOffset()/60 * 100)).toString();
    
    return localHour.slice(0, localHour.length-2) + ":" + localHour.slice(localHour.length-2);
};
