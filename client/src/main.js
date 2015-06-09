'use strict';

var React = require('react');
var serverAPI = require('./serverAPI.js');
var makeMap = require('./utils.js').makeMap;

var Application = React.createFactory(require('./Components/Application.js'));


var errlog = console.error.bind(console);

var mapbox = require('./mapbox-credentials.json');

var BORDEAUX_COORDS = [44.84, -0.57];

var topLevelStore = {
    mapBoxToken: mapbox.token,
    mapId: mapbox.mapId,
    mapCenter: BORDEAUX_COORDS,
    recyclingCenterMap: undefined,
    selectedID: undefined,
    getRecyclingCenterDetails: function(rc){
        serverAPI.getRecyclingCenterDetails(rc.id)
            .then(function(details){
                console.log('rc details', rc, details);
                
                // sort by asc time in case it's not already thus sorted
                details.sort(function(d1, d2){
                    return new Date(d1.measurement_date).getTime() - new Date(d2.measurement_date).getTime()
                })
            
                rc.details = details;
                topLevelStore.selectedID = rc.id;
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
serverAPI.getRecyclingCenters()
    .then(function(recyclingCenters){
        console.log('recyclingCenters', recyclingCenters);
    
        topLevelStore.recyclingCenterMap = makeMap(recyclingCenters);
    
        render();
    })
    .catch(errlog);
