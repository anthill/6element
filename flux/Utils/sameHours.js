'use strict';

module.exports = function(d1, d2){
    //ISSUE #7
    //don't compare each values if both list are not the same length
    
    var same = true;
    if (d1.length !== d2.length) {
        same = false;
        return same;
    }
    
    else{
        d1.forEach(function(session, index){
            if (session.start !== d2[index].start &&
                !session.end !== d2[index].end){
                same = false;
                return same;
            }
        });
    }
    return same;
        
};
