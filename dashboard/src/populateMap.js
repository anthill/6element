(function(global){
    'use strict';
    
    var today = new Date();
    var TODAY_DATE_KEY = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate();
    
    /*
    expects predictions to be an object key'd on recycling center name and value'd with objects:
    {
        'YYYY-MM-DD': number // amount. TODO: Should be a number
    }
    */
    global.populateMap = function populateMap(data, coords, leafletMap){

        console.log('populateMap data', data);

        var overlay = document.body.querySelector('.overlay');
        overlay._on('click', function(e){
            if(e.target === e.currentTarget){ // only consider clicks on the overlay directly
                overlay._hide();
            }
        });
        document._on('keypress', function(e){
            if(!overlay.hasAttribute('hidden') && e.keyCode === 27) // esc
                overlay._hide();
        });
        
        
        var calendar = document.body.querySelector('.calendar');
        var calendarData = calendar.querySelector('.data');
        var calendarTitle = calendar.querySelector('h1');

        Object.keys(data).forEach(function(dechName){
            var dech = data[dechName];

            var dechCoords = coords[dechName];
            if(!dechCoords || (dechCoords.long === "0" && dechCoords.lat === "0")){
                console.warn('No long/lat coordinates for', dechName);
                return;
            }
            
            
            function markerClickHandler(e){
                calendarData._empty();
                overlay._show();

                var docFrag = document.createDocumentFragment();
                makeCalendar(dech, docFrag);
                calendarData.appendChild(docFrag);

                calendarTitle.textContent = dechName;

                calendar.style.opacity = "0";
                setTimeout(function(){
                    calendar.style.transition = 'opacity 0.7s';
                    calendar.style.opacity = '1';
                });
                calendar._once('transitionend', function(){
                    calendar.style.transition = '';
                    calendar.style.opacity = '';
                });
            }
            
            // Add markers asap with an approximate color
            var icon = L.divIcon({
                className: 'recycling-center',
                iconSize: L.Point(0, 0) // when iconSize is set, CSS is respected. Otherwise, it's overridden -_-#
            });
            
            var marker = L.marker([dechCoords.lat, dechCoords.long], {icon: icon});
            marker.on('click', markerClickHandler);
            
            leafletMap.addLayer(marker);
            
            // when receiving the data, update the marker color to today's color
            dataP.then(function(data){
                var relevantData = data[dechName];
                var colorClass = color(relevantData[TODAY_DATE_KEY]);
                console.log(dechName, TODAY_DATE_KEY, colorClass);
                
                leafletMap.removeLayer(marker);
                icon = L.divIcon({
                    className: ['recycling-center', colorClass].join(' '),
                    iconSize: L.Point(0, 0) // when iconSize is set, CSS is respected. Otherwise, it's overridden -_-#
                });  
                marker = L.marker([dechCoords.lat, dechCoords.long], {icon: icon}).addTo(leafletMap)
            });
            
        });
    };

})(this);
