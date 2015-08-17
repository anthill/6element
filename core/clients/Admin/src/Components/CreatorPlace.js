'use strict';

var React = require('react');

/*

interface SelectorProps{
    onCreatePlace: function()
}
interface SelectorState{
}


*/

var CreatorPlace = React.createClass({
    displayName: 'CreatorPlace',

    componentDidMount: function(){
        var button = React.findDOMNode(this.refs.openButton);
        button.addEventListener('click', this.toggleOpen);
    },

    componentWillUnmount: function(){
        var button = React.findDOMNode(this.refs.openButton);
        button.addEventListener('click', this.toggleOpen);
    },

    toggleOpen: function(){
        console.log('click');
        var panel = React.findDOMNode(this);
        console.log('panel', panel);
        panel.classList.toggle('open');
    },

    clearInputs: function(){
        var nameInput = React.findDOMNode(this.refs.myNameInput);
        var latInput = React.findDOMNode(this.refs.myLatInput);
        var longInput = React.findDOMNode(this.refs.myLongInput);
        var submitButton = React.findDOMNode(this.refs.mySubmitButton);
        
        nameInput.blur();
        latInput.blur();
        longInput.blur();
        submitButton.blur();
        nameInput.value = ''; 
        latInput.value = ''; 
        longInput.value = ''; 
    },
    
    render: function() {
        var self = this;
        var props = this.props;
        // var state = this.state;

        // console.log('CreatorPlace props', props);
        // console.log('CreatorPlace state', state);

        return React.DOM.div({className: 'creator'},
            // React.DOM.div({}, "New place"),
            React.DOM.form({
                    onSubmit: function(e){
                        e.preventDefault();
                
                        console.log('Creating Place');

                        props.onCreatePlace({
                            'name': e.target.placeName.value,
                            'lat': e.target.latitude.value,
                            'lon': e.target.longitude.value
                        });

                        self.clearInputs();
                        self.toggleOpen();
                    }
                },
                React.DOM.input({
                    type: 'text',
                    ref: 'myNameInput',
                    name: 'placeName',
                    // value: self.state.placeNameInput,
                    placeholder: "Name"//,
                }),
                React.DOM.input({
                    type: 'text',
                    ref: 'myLatInput',
                    name: 'latitude',
                    // value: self.state.latitudeInput,
                    placeholder: "Latitude"
                }),
                React.DOM.input({
                    type: 'text',
                    ref: 'myLongInput',
                    name: 'longitude',
                    // value: self.state.longitudeInput,
                    placeholder: "longitude"
                }),
                React.DOM.input({
                    type: 'submit',
                    ref: 'mySubmitButton',
                    name: 'submit',
                    value: "Add"
                })
            ),
            React.DOM.div({
                    ref: 'openButton',
                    className: 'clickable'
                },  
                'New place'
            )
        );
    }
});

module.exports = CreatorPlace;
