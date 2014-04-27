(function(){
    'use strict';
    
    // unfortunate this is defer-loaded
    d3.csv("data/predictions.csv", function(error, csv) {
        console.log('csv', csv);

        var map = document.body.querySelector('.map');
        var calendar = document.body.querySelector('.calendar');
        
        csv.forEach(function(dech){
            var dechName = dech.decheterie;
            delete dech.decheterie;
            Object.freeze(dech);
            
            var button = document.createElement('button');
            button.textContent = dechName;
            
            button.addEventListener('click', function(e){
                calendar.innerHTML = ''; // empty
                makeCalendar(dech, calendar);
            });
            
            map.appendChild(button);
        });
        
    });

})()