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
                )
            )
        );

        /*return React.DOM.div({className: 'ant'},
            React.DOM.h1({}, props.ant.name),
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, 'Lieu'),
                    React.DOM.div({}, props.ant.place)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Coords'),
                    React.DOM.div({}, props.ant.coords)
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Quipu Status'),
                    React.DOM.div({}, props.ant.quipuStatus),
                    React.DOM.ul({},
                        React.DOM.li({}, 
                            React.DOM.div({}, 'Phone Number'),
                            React.DOM.div({}, props.ant.phone)
                        ),
                        React.DOM.li({}, 
                            React.DOM.div({}, 'Signal'),
                            React.DOM.div({}, props.ant.signal)
                        ),
                        React.DOM.li({}, 
                            React.DOM.div({}, 'Registration'),
                            React.DOM.div({}, props.ant.registration)
                        ),
                        React.DOM.li({}, 
                            React.DOM.div({}, 'ip'),
                            React.DOM.div({}, props.ant.ip)
                        )
                    )
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, '6sense Status'),
                    React.DOM.div({}, props.ant.senseStatus)
                )
            )
        );*/
    }
});

module.exports = Ant;
