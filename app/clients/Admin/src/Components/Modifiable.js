'use strict';

var React = require('react');

/*

interface ModifiableProps{
    text: string or int or float
}
interface ModifiableState{
    clicked: boolean
}

*/

var Modifiable = React.createClass({
    displayName: 'Modifiable',

    getInitialState: function(){
        return {
            clicked: false
        };
    },

    toggleState: function(){
        var self = this;
        console.log('CLICK');
        this.setState({
            clicked: !this.state.clicked
        }, function(){
            this.getDOMNode().focus();
            var val = this.getDOMNode().input.value; //store the value of the element
            this.input.value = ''; //clear the value of the element
            this.input.value = val;
        });
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('MODIFIABLE props', props);
        console.log('MODIFIABLE state', state);

        var content = state.clicked ? 
            React.DOM.input({
                className: 'modifiable clicked',
                type: 'text',
                defaultValue: props.text,
                autofocus: true,
                onFocus: this.defaultValue = this.defaultValue
                // onClick: this.toggleState
            })
            : React.DOM.div({
                className: 'modifiable',
                onClick: this.toggleState
            }, props.text);

        return content;
    }
});

module.exports = Modifiable;
