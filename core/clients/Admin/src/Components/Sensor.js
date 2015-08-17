'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var PlacePicker = React.createFactory(require('./PlacePicker.js'));
var DeleteButton = React.createFactory(require('./DeleteButton.js'));

/*
interface SensorProps{   
    Sensor: {
        created_at : string,
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
    },
    placeIDMap: Map(),
    placeName: string,
    placeId: placeId,
    onChangeSensor: function(),
    onChangePlace: function()
    onRemoveSensor: function()
}

interface SensorState{
    isListOpen: boolean
}

*/


var Sensor = React.createClass({
    displayName: 'Sensor',

    getInitialState: function(){
        return {
            isOpen: false
        };
    },

    toggleList: function(){
        this.setState({isListOpen: !this.state.isListOpen});
    },

    removeSensor: function(){
        var props = this.props;
        var dbData = {
            sensorId: props.sensor.id 
        };

        props.onRemoveSensor(dbData);
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('SENSOR props', props);
        // console.log('SENSOR state', state);

        var classes = [
            'sensor',
            props.sensor.installed_at ? '' : 'orphan'
        ];

        if (props.sensor.id === 1){
            props.placeIDMap.forEach(function(id, name){
                console.log('place in SENSOR', id, name);
            })
        }

        // Sensor Name, is a Modifiable
        var sensorName = React.DOM.li({}, 
            new Modifiable({
                className: 'name',
                isUpdating: false,
                text: props.sensor.name,
                dbLink: {
                    id: props.sensor.id,
                    field: 'name'
                },
                onChange: props.onChangeSensor
            })
        );

        // Sensor Place, can be toggled
        var sensorPlace = React.DOM.li({className: 'sensorPlace clickable',
                onClick: function(){
                    document.querySelector('body').classList.toggle('noscroll');
                    self.toggleList();
                }
            },
            props.sensor.installed_at ? props.placeName : "Add me a place",
            new PlacePicker({
                placeIDMap: props.placeIDMap,
                placeId: props.placeId,
                sensorId: props.sensor.id,
                isOpen: state.isListOpen,
                onChange: function(data){
                    self.toggleList();
                    props.onChangeSensor(data);
                }
            })
        );

        var sensorPhoneNumber = React.DOM.li({}, 
            new Modifiable({
                className: 'sensorPhoneNumber',
                isUpdating: false,
                text: props.sensor.phone_number,
                dbLink: {
                    id: props.sensor.id,
                    field: 'phone_number'
                },
            onChange: props.onChangeSensor
            })
        );

        return React.DOM.div({className: classes.join(' ')},
            new DeleteButton({
                askForConfirmation: true,
                onConfirm: this.removeSensor
            }),
            React.DOM.ul({},
                sensorName,
                sensorPlace,
                sensorPhoneNumber    
            )
        );
    }
});

module.exports = Sensor;
