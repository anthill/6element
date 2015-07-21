'use strict';

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));
    
var makeMap = require('./utils/utils.js').makeMap;

var rcsJson = require('./rcs.json');
var rcs = makeMap(rcsJson, 'id');

//add bool isFav() for each RC

// Initial rendering
React.render(new Application({
    rcs : rcs,
    onFavChange : function(/*favourite*/){
        //to change userFake's fav
    }
}), document.body);
