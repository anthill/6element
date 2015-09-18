'use strict';

module.exports = function(maxSize, crowdMoment){
    var ratio = parseFloat((crowdMoment / maxSize).toFixed(2));
    if(Number.isNaN(ratio))
        return undefined;
    
    if (ratio <= 0.50)
        return 0;
    else {
        return ratio <= 0.75 ? 1 : 2;
    }
};
