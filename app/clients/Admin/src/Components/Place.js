'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var Ant = React.createFactory(require('./Ant.js'));

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
	mySensors {
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
	},
	onChange: function()
}

interface AppState{
}

*/


var Place = React.createClass({
    displayName: 'Place',

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
            new Modifiable({
                className: 'placeName',
                isUpdating: false,
                text: props.place.name,
                dbLink: {
                    table: 'place',
                    id: props.place.id,
                    field: 'name'
                },
                onChange: props.onChange
            }),
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, 'Coords'),
                    new Modifiable({
                        isUpdating: false,
                        text: props.place.lat,
                        dbLink: {
                            table: 'place',
                            id: props.place.id,
                            field: 'lat'
                        },
                        onChange: props.onChange
                    }),
                    new Modifiable({
                        isUpdating: false,
                        text: props.place.lon,
                        dbLink: {
                            table: 'place',
                            id: props.place.id,
                            field: 'lon'
                        },
                        onChange: props.onChange
                    })
                ),
                React.DOM.div({}, 
        			props.mySensors.map(function (ant){
                		return new Ant({
                			ant: ant,
                			onChange: props.onChange
            			});
            		})
                )
            )
        )
    }
});

module.exports = Place;