(function(global){
    'use strict';
    
    global.populateMap = function populateMap(predictions, coords, leafletMap){
        
        var calendar = document.body.querySelector('.calendar');
            
        predictions.forEach(function(dech){
            var dechName = dech.decheterie;
            delete dech.decheterie;
            Object.freeze(dech);

            var dechCoords = coords[dechName];
            if(!dechCoords || (dechCoords.long === "0" && dechCoords.lat === "0")){
                console.warn('No long/lat coordinates for', dechName);
                return;
            }

            L.marker([dechCoords.lat, dechCoords.long]).addTo(leafletMap)
                .bindPopup(dechName)
                .on('click', function(e){
                    console.log('data for', dechName, dech);
                    calendar.innerHTML = '';
                    makeCalendar(dech, calendar);
                });
        });
    };
    
})(this);