'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));

/*

interface AntProps{
    ant: {
        id: int,
        name: string,
        phone_number: string,
        installed_at: string,
        latLng: {
            lat: float,
            long: float
        },
        quipu_status: string,
        signalStrength: int,
        sense_status: string,
        latest_input: string,
        latest_output: string
    }
}
interface AppState{
}

*/

var Ant = React.createClass({
    displayName: 'Ant',

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);
        var classes = [
            'ant',
            // isSelected ? 'selected' : '',
            props.ant.isUpdating ? 'updating' : '',
            props.ant.quipu_status,
            props.ant.sense_status
        ];

        return React.DOM.div({className: classes.join(' ')},
            React.DOM.h1({}, props.ant.name),
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, 'ID'),
                    React.DOM.div({}, props.ant.id)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Installed at'),
                    new Modifiable({text: props.ant.rcName}),
                    React.DOM.div({}, props.ant.installed_at)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Coords'),
                    React.DOM.div({}, props.ant.lat),
                    React.DOM.div({}, props.ant.lon)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Created'),
                    React.DOM.div({}, props.ant.created_at)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Updated'),
                    React.DOM.div({}, props.ant.updated_at)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Phone'),
                    React.DOM.div({}, props.ant.phone_number)
                ),
                React.DOM.li({className: 'quipu'},
                    React.DOM.div({}, 'Quipu Status'),
                    React.DOM.div({}, props.ant.quipu_status),
                    React.DOM.div({}, props.ant.signal)
                ),
                React.DOM.li({className: '6sense'},
                    React.DOM.div({}, '6sense Status'),
                    React.DOM.div({}, props.ant.sense_status)
                ),
                React.DOM.li({className: 'command'},
                    React.DOM.div({}, 'Latest Command'),
                    React.DOM.div({}, props.ant.latest_input),
                    React.DOM.div({}, props.ant.latest_output)
                )
            )
        );
    }
});

module.exports = Ant;
