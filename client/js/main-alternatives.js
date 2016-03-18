"use strict";

(function(){
    
    function getCurrentSearch(){

        var search = location.search.substring(1);
        search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

        if(search.position === undefined) return undefined;
            
        var position = JSON.parse(search.position);

        return {lon: position[0], lat: position[1]};
    }

    var map = createMap(getCurrentSearch(), document.querySelector('#map'));
    var currentMapBoundsPlaces = [];
    var filterValues = [];


    function getCurrentBounds(map){
        var bounds = map.getBounds(); 
        return {
            'maxLat': bounds.getNorth(),
            'minLat': bounds.getSouth(),
            'maxLon': bounds.getEast(),
            'minLon': bounds.getWest()
        };
    }

    function refreshMap(){
        displayPlaces(getCurrentSearch(), map, currentMapBoundsPlaces, filterValues);
    }

    /*
        FILTERS
    */
    fetch('/networks', {headers: {'Content-Type': 'application/json'}})
    .then(function(result){ return result.json() })
    .then(function(networks){
        //console.log('networks', networks)
        filterValues = networks.map(function(network){
            return { name: network.name, color: network.color, checked: true };
        });
        
        var filtersElement = document.querySelector('#filters');

        var ul = createFilterList(filterValues, function(newFilterValues){
            filterValues = newFilterValues;
            refreshMap();
        });

        filtersElement.appendChild(ul);
        
        refreshMap();
    })
    .catch(function(err){ console.error('fetch /networks error', err) });
    

    map.on('moveend', function(){
        findPlaces(getCurrentSearch(), getCurrentBounds(map))
        .then(function(res){
            currentMapBoundsPlaces = res.objects;
            refreshMap();
        });
    });

    
    /*
        INIT
    */
    findPlaces(getCurrentSearch(), getCurrentBounds(map))
    .then(function(result){
        currentMapBoundsPlaces = result.objects;
    })
    .then(refreshMap)
    
    
})();