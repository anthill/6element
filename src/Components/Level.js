'use strict';

var React = require('react');
var Level = React.createFactory(require('./Level.js'));

/*

interface LevelProps{
    date: string ISO,
    waiting: [color, message],
    gapNow : boolean,
    oClock : boolean   
    
}
interface LevelState{

*/


var Level = React.createClass({
    displayName: 'Level',
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
        var displayHour ;
              
        var classes = [
            'inline ',
            'colorBlock ',
            props.waiting[0],
            'Font '
        ];
        
        if (props.gapNow) classes.push('border ')
        
        // console.log('APP props', props);
        // console.log('APP state', state);
        
        return React.DOM.div({className : 'inline'},
            React.DOM.div({className: classes.join('')}),
            React.DOM.div({className : 'colorBlock'}, props.oClock ));
    }
});

module.exports = Level;
