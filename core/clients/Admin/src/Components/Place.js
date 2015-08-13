'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var Ant = React.createFactory(require('./Ant.js'));
var DeleteButton = React.createFactory(require('./DeleteButton.js'));
var AntPicker = React.createFactory(require('./AntPicker.js'));

/*
interface placeProps{
    place: {
        created_at: string,
        id: int,
        lat: int,
        lon: int,
        name: string,
        sensor_ids: array
    },  
    mySensors: [{
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
    antFromNameMap: Immutable Map,
    selectedAntSet: Set(id),
    onChangePlace: function(),
    onChangeSensor: function(),
    onSelectedAnts: function(),
    onRemovePlace: function()
}

interface AppState{
    isListOpen: boolean
}

*/


var Place = React.createClass({
    displayName: 'Place',

    getInitialState: function(){
        return {
            isListOpen: false
        };
    },

    toggleList: function(){
        this.setState(Object.assign(this.state, {
            isListOpen: !this.state.isListOpen
        }));
    },

    removePlace: function(){
        var props = this.props;
        var obj = {};
                        
        console.log('onclick remove Place', props.place.id);
        var ants = props.mySensors.map(function (ant) {
            return {
                'field': "installed_at",
                'id': ant.id,
                'value': null
            };
        });

        obj.ants = ants;
        obj['placeId'] = props.place.id;

        props.onRemovePlace(obj);
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        // console.log('PLACE props', props);
        // console.log('PLACE state', state);

        var classes = [
            'place'
        ];

        // Delete Button
        var deleteButton = new DeleteButton({
            askForConfirmation: true,
            onConfirm: this.removePlace
        });

        // Name
        var placeName = new Modifiable({
            className: 'placeName',
            isUpdating: false,
            text: props.place.name,
            dbLink: {
                id: props.place.id,
                field: 'name'
            },
            onChange: props.onChangePlace
        });

        // Coordinates
        var coords = React.DOM.div({className: 'coords'}, 
            React.DOM.div({}, 'Coords'),
            new Modifiable({
                isUpdating: false,
                text: props.place.lat,
                dbLink: {
                    id: props.place.id,
                    field: 'lat'
                },
                onChange: props.onChangePlace
            }),
            new Modifiable({
                isUpdating: false,
                text: props.place.lon,
                dbLink: {
                    id: props.place.id,
                    field: 'lon'
                },
                onChange: props.onChangePlace
            })
        );

        // List of installed Sensors
        var availableSensorMap = props.antFromNameMap;

        var installedSensors = props.mySensors.map(function (ant){

            availableSensorMap = availableSensorMap.delete(ant.name);

            return new Ant({
                key: ant.id,
                ant: ant,
                isSelected: props.selectedAntSet.has(ant.id),
                currentPlaceId: props.place.id,
                onChangeSensor: props.onChangeSensor,
                onSelectedAnts: props.onSelectedAnts
            });
        });

        console.log('nb available', props.place.name, availableSensorMap.size);

        // Button to install Sensor
        var antPicker = state.isListOpen ? new AntPicker({
            antFromNameMap: availableSensorMap,
            currentSensorId: null,
            currentPlaceId: props.place.id,
            onChange: props.onChangeSensor
        })
        : undefined;

        var addAntButton = React.DOM.div({
                className: 'add-ant-button clickable',
                onClick: self.toggleList
            },
            'Add Ant',
            antPicker
        );


        return React.DOM.div({className: classes.join(' ')},
            deleteButton,
            placeName,
            coords,
            installedSensors,
            addAntButton
        );
    }
});

module.exports = Place;
