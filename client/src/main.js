'use strict';

var React = require('react');
var dataLoader = require('./dataLoader.js');

var Application = React.createFactory(require('./Components/Application.js'));

var errlog = console.error.bind(console);

var mapbox = require('./mapbox-credentials.json');

var BORDEAUX_COORDS = [44.84, -0.57];

// Initial rendering
React.render(new Application({
    mapBoxToken: mapbox.token,
    mapId: mapbox.mapId,
    mapCenter: BORDEAUX_COORDS
}), document.body);

// Render again when receiving recyclingCenters from API
/*recyclingCentersP.then(function(recyclingCenters){
    React.render(new Application({recyclingCentersData: recyclingCenters}), document.body);
})
.catch(errlog);
*/