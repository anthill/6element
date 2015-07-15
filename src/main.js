'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));
    
var makeMap = require('./utils/utils.js').makeMap;
var rcsFakeJson = require('./rcsFake.json');

var rcsFake = makeMap(rcsFake, 'id');

// Initial rendering
/*React.render(new Application({
    userFake : userFake,
    onFavChange : function(favourite){
        userFake.favouriteRC = favourite;
    }
}), document.body);*/