'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var SelectorPlaceId = React.createFactory(require('./SelectorPlaceId.js'));


/*
interface placeProps{   
    Sensors: [{
        create_at : string,
        id: int,
        installed_at: int,
        isUpdating: boolean,
        latest_input: string,
        latest_output: string,
        name: string,
        phone_number: string,
        quipu_status: string,
        sense_status: string,
        updated_at: string
    }],
    placeIDMap: Map(),
    placeName: string,
    placeId: placeId,
    onChangeSensor: function(),
    onChangePlace: function()
}

interface AppState{
}

*/


var DisplaySensor = React.createClass({
    displayName: 'DisplaySensor',

    getInitialState: function(){
        return {
            isOpen: false
        };
    },

    setOpen: function(isOpen){
        this.setState({isOpen: isOpen});
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('DISPLAYSENSOR props', props);
        // console.log('DISPLAYSENSOR state', state);

        var classes = [
            'displaySensor',
            props.sensor.installed_at ? '' : 'orphan'
            // isSelected ? 'selected' : '',
            // props.ant.isUpdating ? 'updating' : '',
            // props.ant.quipu_status,
            // props.ant.sense_status
        ];

        return React.DOM.div({className: classes.join(' ')},
            
            React.DOM.ul({},

                React.DOM.li({}, 
                    new Modifiable({
                        className: 'DisplaySensorName',
                        isUpdating: false,
                        text: props.sensor.name,
                        dbLink: {
                            id: props.sensor.id,
                            field: 'name'
                        },
                        onChange: props.onChangeSensor
                    }),
                    React.DOM.div({className: 'DisplaySensorPlace',
                            onClick: function(){
                                console.log('onclick DisplaySensorPlace', props.placeName);
                                self.setOpen(!state.isOpen);
                            }
                        },
                        props.sensor.installed_at ? props.placeName : "Add me a place",
                        new SelectorPlaceId({
                            placeIDMap: props.placeIDMap,
                            placeId: props.placeId,
                            sensorId: props.sensor.id,
                            isOpen: state.isOpen,
                            onChange: props.onChangeSensor,
                            setOpen: self.setOpen
                        })

                    )
                ),
                React.DOM.li({}, 
                    new Modifiable({
                        className: 'DisplaySensorPhoneNumber',
                        isUpdating: false,
                        text: props.sensor.phone_number,
                        dbLink: {
                            id: props.sensor.id,
                            field: 'phone_number'
                        },
                        onChange: props.onChangeSensor
                    })
                )
            )
        )
    }
});

module.exports = DisplaySensor;
