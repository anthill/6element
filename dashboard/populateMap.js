(function(global){
    'use strict';
    
    global.populateMap = function populateMap(predictions, coords, leafletMap){
        
        var overlay = document.body.querySelector('.overlay');
        overlay._on('click', function(e){
            if(e.target === e.currentTarget){ // only consider clicks on the overlay directly
                overlay._hide();
            }
        });
        
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
                    
                    calendar._empty();
                    overlay._show();
                    
                    var docFrag = document.createDocumentFragment();
                    makeCalendar(dech, docFrag);
                    calendar.appendChild(docFrag);
                    
                    calendar.style.opacity = "0";
                    setTimeout(function(){
                        calendar.style.transition = 'opacity 0.7s';
                        calendar.style.opacity = '1';
                    });
                    calendar._once('transitionend', function(){
                        calendar.style.transition = '';
                        calendar.style.opacity = '';
                    })
                    
                    
                });
        });
    };
    
})(this);