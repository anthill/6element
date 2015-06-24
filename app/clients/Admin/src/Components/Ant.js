'use strict';

var React = require('react');

/*

interface AntProps{
    ant: {
        id: int,
        name: strint,
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

        return React.DOM.div({id: 'myApp'},
            tabs,
            tabContent
        );
    }
});

module.exports = Ant;
