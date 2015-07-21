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

        console.log('PLACE props', props);
        console.log('PLACE state', state);

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
                )

                // ),
                // React.DOM.li({}, 
                //     React.DOM.div({}, 'ID'),
                //     React.DOM.div({}, props.ant.id)
                // ),
                // React.DOM.li({}, 
                //     React.DOM.div({}, 'Created'),
                //     React.DOM.div({}, moment(props.ant.created_at).format("MMMM Do YYYY, h:mm:ss a"))
                // ),
                // React.DOM.li({}, 
                //     React.DOM.div({}, 'Updated'),
                //     React.DOM.div({}, moment(props.ant.updated_at).fromNow())
                // ),
                // React.DOM.li({}, 
                //     React.DOM.div({}, 'Phone'),
                //     React.DOM.div({}, props.ant.phone_number)
                // ),
                // React.DOM.li({className: 'quipu'},
                //     React.DOM.div({}, 'Quipu Status'),
                //     React.DOM.div({}, props.ant.quipu_status),
                //     React.DOM.div({}, props.ant.signal)
                // ),
                // React.DOM.li({className: '6sense'},
                //     React.DOM.div({}, '6sense Status'),
                //     React.DOM.div({}, props.ant.sense_status)
                // ),
                // React.DOM.li({className: 'command'},
                //     React.DOM.div({}, 'Latest Command'),
                //     React.DOM.div({}, props.ant.latest_input),
                //     React.DOM.div({}, props.ant.latest_output)
                // )
            )
        );
    }
});

module.exports = Place;