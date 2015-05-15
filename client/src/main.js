'use strict';

var React = require('react');
var dataLoader = require('./dataLoader.js');

var Application = React.createFactory(require('./Components/Application.js'));

var errlog = console.error.bind(console);
var recyclingCentersP = dataLoader( (function(){throw 'TODO'})() );

// Initial rendering
React.render(new Application({}), document.body);

// Render again when receiving recyclingCenters from API
recyclingCentersP.then(function(recyclingCenters){
    React.render(new Application({recyclingCentersData: recyclingCenters}), document.body);
})
.catch(errlog);
