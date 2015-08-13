'use strict';

var React = require('react');

/*
interface CommandManagerProps{   
    ants: [Ant],
    sendCommand: function,
    isOpen: boolean
}

interface CommandManagerState{
    command: string
}

*/


var CommandManager = React.createClass({
    displayName: 'CommandManager',

    getInitialState: function(){
        return {
            command: undefined
        };
    },

    render: function() {
        var self = this;
        var props = this.props;

        // console.log('CommandManager props', props);
        console.log('CommandManager state', this.state.value);

        var classes = [
            'command-manager',
            props.isOpen ? 'open' : ''
        ];

        var header = React.DOM.div({}, 'Send command to: ' + props.ants.join(' '));
        
        var input = React.DOM.input({  
                placeholder: 'Type command',
                value: self.state.command,
                onKeyUp: function(event){

                    var key = (event.which) ? event.which : 
                        ((event.charCode) ? event.charCode : 
                            ((event.keyCode) ? event.keyCode : 0));

                    if (key === 13)
                        console.log('command: ', event.target.value);
                }
            }
        );

        var clearButton = React.DOM.div({
            className: 'clear clickable',
                onClick: function(){
                    props.clearSelection();
                    self.setState({
                        command: undefined
                    });
                    
                }
            },
            'clear'
        );

        return React.DOM.div({className: classes.join(' ')},
            header,
            input,
            clearButton
        );
    }
});

module.exports = CommandManager;
