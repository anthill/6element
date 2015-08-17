'use strict';

var React = require('react');

/*
interface CommandManagerProps{   
    antMap: Map (integer -> string),
    sendCommand: function,
    clearSelection: function,
    isOpen: boolean
}

interface CommandManagerState{
    command: string
}

*/


var CommandManager = React.createClass({
    displayName: 'CommandManager',

    // getInitialState: function(){
    //     return {
    //         command: 'TEST'
    //     };
    // },

    clearInput: function(){
        var textInput = React.findDOMNode(this.refs.myTextInput);
        
        textInput.blur();
        textInput.value = ''; 

        this.props.clearSelection();
    },

    // componentDidMount: function(){
    //     var clearButton = React.findDOMNode(this.refs.myClearButton);
    //     clearButton.addEventListener('click', this.clearInput);
    // },

    // componentDidUnmount: function(){
    //     var clearButton = React.findDOMNode(this.refs.myClearButton);
    //     clearButton.removeEventListener('click', this.clearInput);
    // },

    render: function() {
        var self = this;
        var props = this.props;

        var classes = [
            'command-manager',
            props.isOpen ? 'open' : ''
        ];

        // Display of selected Ant names
        // In the future, maybe create a Deselector component instead
        var antNames = [];
        props.antMap.forEach(function(antName){
            antNames.push(antName);
        });

        var header = React.DOM.div({}, 'Send command to: ' + antNames.join(' '));
        
        var input = React.DOM.input({  
                placeholder: 'Type command',
                ref: 'myTextInput',
                onKeyUp: function(event){

                    var key = (event.which) ? event.which : 
                        ((event.charCode) ? event.charCode : 
                            ((event.keyCode) ? event.keyCode : 0));

                    if (key === 13){
                        props.sendCommand(event.target.value);
                        event.target.value = '';
                    }
                        
                }
            }
        );

        var clearButton = React.DOM.div({
                className: 'clear clickable',
                ref: 'myClearButton',
                onClick: self.clearInput
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
