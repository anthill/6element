'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var Display_sensor_id = React.createFactory(require('./Display_sensor_id.js'));
var Selector_sensor_id = React.createFactory(require('./Selector_sensor_id.js'));



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
}

*/


var PlaceOrphan = React.createClass({
    displayName: 'PlaceOrphan',

    getInitialState: function(){
        return {
            isOpen: false
        };
    },

    setOpen: function(isOpen){
        this.setState({isOpen: isOpen});
    },

    render: function() {
        // var self = this;
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
                    new Display_sensor_id({
                        currentSensorId: 'Add sensor',
                        isOpen: state.isOpen,
                        setOpen: this.setOpen
                    }),
                    new Selector_sensor_id({
                        antIDset: props.antIDset,
                        currentSensorId: null,
                        isOpen: state.isOpen,
                        currentPlaceId: props.place.id,
                        onChange: props.onChangeSensor,
                        setOpen: this.setOpen
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
