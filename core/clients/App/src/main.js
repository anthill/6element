'use strict';

var React = require('react');
var io = require('socket.io-client');

var Application = React.createFactory(require('./Components/Application.js'));

var serverAPI = require('./serverAPI.js');
var makeMap = require('../../_common/js/makeMap.js');

var errlog = console.error.bind(console);

var PRIVATE = require('../../../PRIVATE.json');

var BORDEAUX_COORDS = [44.84, -0.57];

var topLevelStore = {
    mapBoxToken: PRIVATE.mapbox_token,
    mapId: PRIVATE.map_id,
    mapCenter: BORDEAUX_COORDS,
    placeMap: undefined,
    selectedPlaceMap: new Map(),
    updatingIDs: [],
    getPlaceMeasurements: function(place){
        serverAPI.getPlaceMeasurements(place.id)
            .then(function(details){
                console.log('place measurements', place, details);
                
                // sort by asc time in case it's not already thus sorted
                details.sort(function(d1, d2){
                    return new Date(d1.measurement_date).getTime() - new Date(d2.measurement_date).getTime()
                })
            
                place.details = details;
                topLevelStore.selectedPlaceMap.set(place.id, place);
                render();
            })
            .catch(errlog);
    }
};

function render(){
    React.render(new Application(topLevelStore), document.body);
}

// Initial rendering
render();

// Render again when receiving recyclingCenters from API
serverAPI.getAllPlacesLiveAffluence()
    .then(function(places){
        console.log('places', places);

        topLevelStore.placeMap = makeMap(places, 'id');
        render();
    })
    .catch(errlog);

var socket = io();

socket.on('data', function (results) {

    results.forEach(function(result){
        // GET DATA
        var id = result.measurement.installed_at;

        var value = result.measurement.signal_strengths.length;
        var date = result.measurement.measurement_date;

        // console.log('results', value);
        
        // GET PLACE
        var place = topLevelStore.placeMap.get(id);
        
        place.max = Math.max(place.max, value);
        place.latest = value;

        if (place.details)
        // UPDATE CURVE
            place.details.push({
                measurement_date: date,
                measurement: value
            });

        topLevelStore.updatingIDs.push(id);
    })

    render();

    setTimeout(function(){
        topLevelStore.updatingIDs = [];
        render();
    }, 200);

});
