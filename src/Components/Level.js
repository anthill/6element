'use strict';

var React = require('react');
var Level = React.createFactory(require('./Level.js'));



/*

interface LevelProps{
    date: string
    waiting: integer between 0 and 2 (include)
}
interface LevelState{
}

*/

var colors = ['green', 'orange','red'];

var Level = React.createClass({
    displayName: 'Level',
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
              
        var classes = [
              'level',
              colors[props.waiting]
        ];
        
        // console.log('APP props', props);
        // console.log('APP state', state);
        
        return React.DOM.div({className: classes.join(' ')});
    }
});

module.exports = Level;
