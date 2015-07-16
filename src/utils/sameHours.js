'use strict';

var React = require('react');

module.exports = function(d1,d2){
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