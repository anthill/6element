'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));

var rcObject = require('../Data/dech.json');
//var rcList = require('../Data/test.json');

var rcs = [];

rcObject.features.forEach(function(rc, index){
    
    rcs.push({
        id: index,
        name: rc.properties.name,
        owner: rc.properties.owner,
        address: rc.properties.address,
        phne: rc.properties.phone,
        equiped: rc.properties.equiped,
        own_equipement: rc.properties.own_equipement,
        coords: {
            lat: rc.geometry.coordinates[0],
            long: rc.geometry.coordinates[1],
        }      
    });    
    
});

// Initial rendering
React.render(new Application({
    rcs: rcs
}), document.body);