'use strict';

var React = require('react');
var Level = React.createFactory(require('./Level.js'));

var levelCalc = require('../utils.js').levelCalc;



/*

interface LevelsProps{
    crowd: [{},{} ...] 
    maxSize: integer
}
interface LevelsState{
}

*/

var Levels = React.createClass({
    displayName: 'Levels',
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);
        
        
        var myLevels = props.crowd.map(function(gap){
            var waiting = levelCalc(props.maxSize, gap.value);
            return new Level({
                date: gap.date,
                waiting: waiting
            }); 
        });        
        return React.DOM.div({className: 'levels'},
            myLevels
        );
    }
});

module.exports = Levels;
