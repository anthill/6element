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


var Level = React.createClass({
    displayName: 'Level',
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
              
        var classes = [
            'inline ',
            'colorBlock ',
            props.waiting[0],
            'Font '
        ];
        
        if (props.gapNow) classes.push('border')
        
        // console.log('APP props', props);
        // console.log('APP state', state);
        
        return React.DOM.div({className: classes.join('')});
    }
});

module.exports = Level;
