'use strict';

var React = require('react');
var io = require('socket.io-client');

var Application = React.createFactory(require('./Components/Application.js'));

var serverAPI = require('../../_common/js/serverAPI.js');
var makeMap = require('../../_common/js/makeMap.js');

var errlog = console.error.bind(console);

var PRIVATE = require('../../../PRIVATE.json');

var BORDEAUX_COORDS = [44.84, -0.57];

var topLevelStore = {
    mapBoxToken: PRIVATE.mapbox_token,
    mapId: PRIVATE.map_id,
    mapCenter: BORDEAUX_COORDS,
    recyclingCenterMap: undefined,
    selectedRCMap: new Map(),
    updatingIDs: [],
    getRecyclingCenterDetails: function(rc){
        serverAPI.getRecyclingCenterDetails(rc.id)
            .then(function(details){
                console.log('rc details', rc, details);
                
                // sort by asc time in case it's not already thus sorted
                details.sort(function(d1, d2){
                    return new Date(d1.measurement_date).getTime() - new Date(d2.measurement_date).getTime()
                })
            
                rc.details = details;
                topLevelStore.selectedRCMap.set(rc.id, rc);
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
    
        topLevelStore.recyclingCenterMap = makeMap(recyclingCenters, 'id');
        render();
    })
    .catch(errlog);

var socket = io();

socket.on('data', function (results) {

    results.forEach(function(result){
        // GET DATA
        var id = result.installed_at;

        var value = result.signal_strengths.length;
        var date = result.measurement_date;
        
        // GET RECYCLING CENTER
        var rc = topLevelStore.recyclingCenterMap.get(id);
        console.log('rc', rc);
        
        rc.max = Math.max(rc.max, value);
        rc.latest = value;

        if (rc.details)
        // UPDATE CURVE
            rc.details.push({
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
