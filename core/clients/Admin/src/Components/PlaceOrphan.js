'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
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
    antIDset : Set,
    onChangePlace: function(),
    onChangeSensor: function(),
    onDeletePlace: functtion()
}

interface AppState{
    isListOpen: boolean
}

*/


var PlaceOrphan = React.createClass({
    displayName: 'PlaceOrphan',

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

        // console.log('PLACE Orphan props', props);
        // console.log('PLACE Orphan state', state);

        var classes = [
            'placeOrphan'
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

                        obj.ants = []; // no ant in an orphan
                        obj['placeId'] = props.place.id;

                        props.onDeletePlace(obj);
                    }
                },
                "X"
            ),
            React.DOM.ul({},
                React.DOM.li({}, 
                    new Modifiable({
                        className: 'placeOrphanName',
                        isUpdating: false,
                        text: props.place.name,
                        dbLink: {
                            id: props.place.id,
                            field: 'name'
                        },
                        onChange: props.onChangePlace
                    }),
                    React.DOM.div({
                            className: 'ant-id',
                            onClick: self.toggleList
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
