'use strict';

var React = require('react');

/*

interface ModifiableProps{
    text: string or int or float,
    dbLink: {
        table: string,
        id: int,
        field: string
    },
    onChange: function()
    onChangePlace: function()
}
interface ModifiableState{
    isUpdating: boolean,
    text: string or int or float,
    inputMode: boolean
}

*/

var Modifiable = React.createClass({
    displayName: 'Modifiable',

    getInitialState: function(){
        return {
            isUpdating: this.props.isUpdating,
            text: this.props.text,
            inputMode: false
        };
    },

    componentWillReceiveProps: function(newProps){
        this.setState({
            isUpdating: newProps.isUpdating,
            text: newProps.text
        });
    },

    morphToInput: function(){
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
        var props = this.props;

        if (key === 13){
            console.log('Enter pressed');

            var newValue = this.getDOMNode().value;

            var dbLink = Object.assign(props.dbLink, {
                value: newValue
            });

            props.onChange([dbLink]);

            this.setState({
                isUpdating: true,
                text: newValue,
                inputMode: false
            }, function(){
                window.removeEventListener('keyup', this.morphToDiv);
            });
        }
        else if (key === 27){
            console.log('Escape pressed');

            this.setState({
                inputMode: false
            }, function(){
                window.removeEventListener('keyup', this.morphToDiv);
            });
        }
        
    },

    render: function() {
        //var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('MODIFIABLE props', props);
        // console.log('MODIFIABLE state', state);

        var classes = [
            'modifiable',
            'clickable',
            state.inputMode ? 'clicked' : '',
            // isSelected ? 'selected' : '',
            state.isUpdating ? 'updating' : '',
            props.className
        ];

        var content = state.inputMode ? 
            // if clicked, returns an input
            React.DOM.input({
                className: classes.join(' '),
                type: 'text',
                defaultValue: state.text
            })
            // if not clicked, returns a simple div
            : React.DOM.div({
                className: classes.join(' '),
                onClick: this.morphToInput
            }, state.text);

        return content;
    }
});

module.exports = Modifiable;
