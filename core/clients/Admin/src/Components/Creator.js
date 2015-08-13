'use strict';

var React = require('react');

/*

interface SelectorProps{
    onCreatePlace: function()
}
interface SelectorState{
}


*/

var Creator = React.createClass({
    displayName: 'Creator',

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

        // console.log('Creator props', props);
        // console.log('Creator state', state);

        return React.DOM.div({className: 'creator'},
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, "Adding a place"),
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
                        }
                    },
                        React.DOM.input({
                            type: 'text',
                            ref: 'myNameInput',
                            name: 'placeName',
                            // value: self.state.placeNameInput,
                            placeholder: "Place's name"//,
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
                            value: "Créer"
                        })
                    )
                )
            )
        );
    }
});

module.exports = Creator;
