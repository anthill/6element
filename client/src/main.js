'use strict';

var React = require('react');
var serverAPI = require('./serverAPI.js');

var Application = React.createFactory(require('./Components/Application.js'));


var errlog = console.error.bind(console);

var mapbox = require('./mapbox-credentials.json');

var BORDEAUX_COORDS = [44.84, -0.57];

var recyclingCentersP = serverAPI.getRecyclingCenters();

var topLevelStore = {
    mapBoxToken: mapbox.token,
    mapId: mapbox.mapId,
    mapCenter: BORDEAUX_COORDS,
    recyclingCenters: undefined,
    selectedRecyclingCenter: undefined,
    getRecyclingCenterDetails: function(rc){
        serverAPI.getRecyclingCenterDetails(rc.id)
            .then(function(details){
                console.log('rc details', rc, details);
                details.sort(function(d1, d2){
                    return new Date(d1.measurement_date).getTime() - new Date(d2.measurement_date).getTime()
                })
            
                rc.details = details;
                topLevelStore.selectedRecyclingCenter = rc;
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
recyclingCentersP
    .then(function(recyclingCenters){
        console.log('recyclingCenters', recyclingCenters);
    
        topLevelStore.recyclingCenters = recyclingCenters;
    
        render();
    })
    .catch(errlog);
