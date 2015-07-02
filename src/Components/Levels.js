'use strict';

var React = require('react');
var Level = React.createFactory(require('./Level.js'));

var levelCalc = require('../utils.js').levelCalc;
var crowdMoment = require('../utils.js').crowdMoment;



/*

interface LevelsProps{
    crowd: [{},{} ...] 
    maxSize: integer,
    waitingMessages = [string color, string message][]
    now : Date
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
            var waiting = props.waitingMessages[levelCalc(props.maxSize, gap.value)];
            var gapNow = false;
            if ((crowdMoment(Date.parse(props.now), props.crowd).date) === gap.date) 
                gapNow = true ;
            
            return new Level({
                date: gap.date,
                waiting: waiting,
                gapNow : gapNow
            }); 
        });        
        return React.DOM.div({className: 'inline'},
            myLevels
        );
    }
});

module.exports = Levels;
