'use strict';

var React = require('react');

function getCrowdLevel(maxSize, crowdMoment){
    
    var ratio = parseFloat((crowdMoment / maxSize).toFixed(2)) ;
    var level;
    
    if (ratio <= 0.50){ level = 0 ; }
    else if(ratio <=0.75) { level = 1; }
    else if (ratio >0.75) {level = 2;}
    else {level = 3;}
           
    return level;
}

module.exports = {
    getCrowdLevel : getCrowdLevel
};