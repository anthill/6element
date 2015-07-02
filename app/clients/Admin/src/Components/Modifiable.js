'use strict';

var React = require('react');

/*

interface ModifiableProps{
    text: string or int or float
}
interface ModifiableState{
    inputMode: boolean
}

*/

var Modifiable = React.createClass({
    displayName: 'Modifiable',

    getInitialState: function(){
        return {
            inputMode: false
        };
    },

    morphToInput: function(){
        console.log('click');

        this.setState({
            inputMode: true
        }, function(){
            window.addEventListener('keyup', this.morphToDiv);

            var element = this.getDOMNode();
            element.focus();
            var val = element.value;
            element.value = val; 
        });
    },

    morphToDiv: function(event){
        var key = (event.which) ? event.which : 
                    ((event.charCode) ? event.charCode : 
                        ((event.keyCode) ? event.keyCode : 0));

        console.log('key', key);

        if (key === 13 || key === 27){
            console.log('Enter or escape');

            this.setState({
                inputMode: false
            }, function(){
                window.removeEventListener('keyup', this.morphToDiv);
            });
        }
        
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('MODIFIABLE props', props);
        console.log('MODIFIABLE state', state);

        var content = state.inputMode ? 
            // if clicked, return an input
            React.DOM.input({
                className: 'modifiable clicked',
                type: 'text',
                defaultValue: props.text
            })
            // if not clicked, return a simple div
            : React.DOM.div({
                className: 'modifiable',
                onClick: this.morphToInput
            }, props.text);

        return content;
    }
});

module.exports = Modifiable;
