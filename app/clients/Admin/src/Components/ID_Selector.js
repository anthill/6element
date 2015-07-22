'use strict';

var React = require('react');

/*

interface SelectorProps{
    antIDSet: Set(antID),
    currentID: int,
    onClick: function(),
    onChange: function()
}
interface SelectorState{
    isOpen: bool
}

*/

var Selector = React.createClass({
    displayName: 'Selector',

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('Selector props', props);
        console.log('Selector state', state);
        
        return React.DOM.div({id: 'selector'},
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, props.currentID)
                )
            )
        );
    }
});

module.exports = Selector;
