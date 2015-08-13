'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var Ant = React.createFactory(require('./Ant.js'));
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
    antIDset : Set,
    selectedAntSet: Set(id),
    onChangePlace: function(),
    onChangeSensor: function(),
    OnSelectedAnts: function(),
    onDeletePlace: function()
}

interface AppState{
    isListOpen: boolean
}

*/


var Place = React.createClass({
    displayName: 'Place',

    getInitialState: function(){
        return {
            isOpen: false
        };
    },

    toggleList: function(){
        this.setState(Object.assign(this.state, {
            isListOpen: !this.state.isListOpen
        }));
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        // console.log('PLACE props', props);
        // console.log('PLACE state', state);

        var classes = [
            'place'
            // isSelected ? 'selected' : '',
            // props.ant.isUpdating ? 'updating' : '',
            // props.ant.quipu_status,
            // props.ant.sense_status
        ];

        return React.DOM.div({className: classes.join(' ')},
            React.DOM.div({
                onClick: function(){
                        var obj = {};
                        
                        console.log('onclick delete Place', props.place.id);
                        var ants = props.mySensors.map(function (ant) {
                            return {
                                'field': "installed_at",
                                'id': ant.id,
                                'value': null
                            };
                        });

                        obj.ants = ants;
                        obj['placeId'] = props.place.id;

                        props.onDeletePlace(obj);
                    }
                },
                "X"
            ),
            new Modifiable({
                className: 'placeName',
                isUpdating: false,
                text: props.place.name,
                dbLink: {
                    id: props.place.id,
                    field: 'name'
                },
                onChange: props.onChangePlace
            }),
            React.DOM.ul({},
                React.DOM.li({}, 
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
                ),
                React.DOM.div({}, 
                    props.mySensors.map(function (ant){
                        return new Ant({
                            key: ant.id,
                            ant: ant,
                            isSelected: props.selectedAntSet.has(ant.id),
                            antIDset: props.antIDset.remove(ant.id),
                            currentPlaceId: props.place.id,
                            onChangeSensor: props.onChangeSensor,
                            onSelectedAnts: props.onSelectedAnts
                        });
                    })
                ),
                React.DOM.div({
                        className: 'ant-id clickable',
                        onClick: function(){
                                console.log('HEYYYYY');
                                self.toggleList();
                            }
                        },
                        'Add Ant'
                    ),
                    new AntPicker({
                        antIDset: props.antIDset,
                        currentSensorId: null,
                        isOpen: state.isListOpen,
                        currentPlaceId: props.place.id,
                        onChange: function(dbData){
                            self.toggleList();
                            props.onChangeSensor(dbData);
                        }
                    })
            )
        )
    }
});

module.exports = Place;
