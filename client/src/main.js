'use strict';

var React = require('react');
var dataLoader = require('./dataLoader.js');

var Application = React.createFactory(require('./Components/Application.js'));


var errlog = console.error.bind(console);

var mapbox = require('./mapbox-credentials.json');

var BORDEAUX_COORDS = [44.84, -0.57];

var recyclingCentersP = dataLoader(location.origin, '/live-affluence');

var topLevelStore = {
    mapBoxToken: mapbox.token,
    mapId: mapbox.mapId,
    mapCenter: BORDEAUX_COORDS
};

// Initial rendering
React.render(new Application(topLevelStore), document.body);

// Render again when receiving recyclingCenters from API
recyclingCentersP
    .then(function(recyclingCenters){
        console.log(recyclingCenters);
    
        topLevelStore.recyclingCenters = recyclingCenters;
    
        React.render(new Application(topLevelStore), document.body);
    })
    .catch(errlog);
