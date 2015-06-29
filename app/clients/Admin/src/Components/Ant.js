'use strict';

var React = require('react');

/*

interface AntProps{
    ant: {
        id: int,
        name: string,
        latLng: {
            lat: float,
            long: float
        },
        ip: string,
        signal: int,
        registration: int,
        quipuStatus: string,
        6senseStatus: string
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

        var status = props.ant.quipu_status !== 'NULL' ? 'sleeping' : '';


        return React.DOM.div({className: 'ant'},
            React.DOM.h1({}, props.ant.name),
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, 'ID'),
                    React.DOM.div({}, props.ant.id)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Name'),
                    React.DOM.div({}, props.ant.name)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Installed at'),
                    React.DOM.div({}, props.ant.installed_at)
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
                React.DOM.li({},
                    React.DOM.div({}, 'Quipu Status'),
                    React.DOM.div({className: status}, props.ant.quipu_status)
                )
            )
        );
    }
});

module.exports = Ant;
