'use strict';

var React = require('react');

/*

interface SelectorProps{
    
}
interface SelectorState{

}


*/

var Creator = React.createClass({
    displayName: 'Creator',
    
    getInitialState: function(){
        return {
           placeNameInput: "",
           latitudeInput: "",
           longitudeInput: ""
        };
    },
    
    render: function() {
        // var self = this;
        var props = this.props;
        var state = this.state;

        console.log('Creator props', props);
        console.log('Creator state', state);

        return React.DOM.div({className: 'creator'},
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, "Adding a place"),
                    React.DOM.form({
                        onSubmit: function(e){
                            e.preventDefault();

                            console.log('Creating Place');

                            props.createPlaceinDB({
                                name: e.target.name,
                                latitude: e.target.latitude,
                                longitude: e.target.longitude
                            });
                        }
                    },
                        React.DOM.input({
                            type: 'text',
                            name: 'placeName',
                            placeholder: "Place's name"//,
                        }),
                        React.DOM.input({
                          type: 'text',
                          name: 'latitude',
                          placeholder: "Latitude"
                        }),
                        React.DOM.input({
                          type: 'text',
                          name: 'longitude',
                          placeholder: "longitude"
                        }),
                        React.DOM.input({
                          type: 'submit',
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
