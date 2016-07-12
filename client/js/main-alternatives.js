"use strict";

(function(global){

    var dictionary = undefined;
    var map = createMap(getCurrentSearch(), document.querySelector('#map'), 14);
    var currentMapBoundsPlaces = [];

    global.translate = function(en){
        return dictionary ? (dictionary[en] || en ) : en;
    }

    function getCurrentBounds(map){
        var bounds = map.getBounds(); 
        return {
            'maxLat': bounds.getNorth(),
            'minLat': bounds.getSouth(),
            'maxLon': bounds.getEast(),
            'minLon': bounds.getWest()
        };
    }

    global.refreshMap = function(){
        displayPlaces(getCurrentSearch(), map, currentMapBoundsPlaces);
    }

    global.reloadMap = function(){

        var certified = document.querySelector('#certified').className === 'btn-active';
        findPlaces(getCurrentSearch(), getCurrentBounds(map), certified)
        .then(function(res){
            currentMapBoundsPlaces = res.objects;
            refreshMap();
        });

    }

    /*
        FILTERS
    */
    fetch('/references', {headers: {'Content-Type': 'application/json'}})
    .then(function(result){ return result.json() })
    .then(function(references){
        
        dictionary = references.dictionary;
        createFilterList(references.categories);
        refreshMap();
    })
    .catch(function(err){ console.error('fetch /categories error', err) });

    map.on('moveend', function(){
        reloadMap();
    });

    
    /*
        INIT
    */
    reloadMap();
    document.querySelector('#uncertified').addEventListener('click', reloadMap);
    document.querySelector('#certified').addEventListener('click', reloadMap);
    showFilters();
})(this);
