'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));
    
var makeMap = require('./utils/utils.js').makeMap;
var rcsFakeJson = require('./rcsFake.json');

var rcsFake = makeMap(rcsFake, 'id');

//add bool isFav() for each RC

// Initial rendering
React.render(new Application({
    rcsFake : rcsFake,
    onFavChange : function(favourite){
        //to change userFake's fav
    }
}), document.body);