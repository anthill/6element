'use strict';

module.exports = function(maxSize, crowdMoment){
    var ratio = parseFloat((crowdMoment / maxSize).toFixed(2));
    
    if (ratio <= 0.50)
        return 0;
    else {
        if (ratio <= 0.75)
            return 1;
        else
            return ratio > 0.75 ? 2 : 3;
    }
};
