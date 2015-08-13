'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var AntPicker = React.createFactory(require('./AntPicker.js'));
var DeleteButton = React.createFactory(require('./DeleteButton.js'));

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
    antFromNameMap : Map,
    onChangePlace: function(),
    onChangeSensor: function(),
    onRemovePlace: functtion()
}

interface AppState{
    isListOpen: boolean
}

*/

// MAYBE THIS COMPONENT SHOULD BE MERGED WITH PLACE
var PlaceOrphan = React.createClass({
    displayName: 'PlaceOrphan',

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
        var dbData = {
            ants: [],
            placeId: props.place.id
        };

        props.onRemovePlace(dbData);
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('PLACE Orphan props', props);
        // console.log('PLACE Orphan state', state);

        var classes = [
            'place',
            'orphan'
            // isSelected ? 'selected' : '',
            // props.ant.isUpdating ? 'updating' : '',
            // props.ant.quipu_status,
            // props.ant.sense_status
        ];

        return React.DOM.div({className: classes.join(' ')},
            new DeleteButton({
                askForConfirmation: true,
                onConfirm: this.removePlace
            }),
            React.DOM.ul({},
                React.DOM.li({}, 
                    new Modifiable({
                        className: 'name',
                        isUpdating: false,
                        text: props.place.name,
                        dbLink: {
                            id: props.place.id,
                            field: 'name'
                        },
                        onChange: props.onChangePlace
                    }),
                    React.DOM.div({
                        className: 'ant-id clickable',
                        onClick: function(){
                                self.toggleList();
                            }
                        },
                        'Add Ant'
                    ),
                    new AntPicker({
                        antFromNameMap: props.antFromNameMap,
                        currentSensorId: null,
                        isOpen: state.isListOpen,
                        currentPlaceId: props.place.id,
                        onChange: function(dbData){
                            self.toggleList();
                            props.onChangeSensor(dbData);
                        }
                    })
                ),
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
                )
            )
        )
    }
});

module.exports = PlaceOrphan;
