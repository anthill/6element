(function(){
    'use strict';
    
    d3.csv("data/predictions.csv", function(error, csv) {
        console.log('csv', csv);

        // doing only one decheterie for now
        var oneDechData = csv[0];
        var dech = oneDechData.decheterie;
        delete oneDechData.decheterie;

        var data = oneDechData;

        makeCalendar(data, document.body);
    });

})()