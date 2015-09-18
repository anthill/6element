'use strict';

var React = require('react');

/*

interface LevelProps{
    date: string ISO,
    waiting: [color, message],
    gapNow : boolean,
    oClock : boolean 
}

*/


module.exports = React.createClass({
    displayName: 'Level',
    
    render: function() {
        //var self = this;
        var props = this.props;
              
        var classes = [
            'inline',
            'colorBlock',
            props.waiting[0] + 'Font'
        ];
        
        if (props.gapNow)
            classes.push('border');
        
        // console.log('APP props', props);
        // console.log('APP state', state);
        
        return React.DOM.div({className : 'inline'},
            React.DOM.div({className: classes.join(' ')}),
            React.DOM.div({className : 'colorBlock'}, props.oClock )
        );
    }
});
