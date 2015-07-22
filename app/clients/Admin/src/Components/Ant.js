'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));

var moment = require('moment');

/*

interface AntProps{
    ant: {
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

var Ant = React.createClass({
    displayName: 'Ant',

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('ANT props', props);
        // console.log('ANT state', state);

        var classes = [
            'ant',
            //isSelected ? 'selected' : '',
            props.ant.isUpdating ? 'updating' : '',
            props.ant.quipu_status,
            props.ant.sense_status
        ];

        return React.DOM.div({className: classes.join(' ')},
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, 'Name'),
                    // React.DOM.div({}, props.ant.id)
                    new Modifiable({
                        className: 'name',
                        isUpdating: false,
                        text: props.ant.name,
                        dbLink: {
                            table: 'sensor',
                            id: props.ant.id,
                            field: 'name'
                        },
                        onChange: props.onChange
                    })
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Created'),
                    React.DOM.div({}, moment(props.ant.created_at).format("MMMM Do YYYY, h:mm:ss a"))
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Updated'),
                    React.DOM.div({}, moment(props.ant.updated_at).fromNow())
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Phone'),
                    // React.DOM.div({}, props.ant.phone_number)
                    new Modifiable({
                        className: 'phone_number',
                        isUpdating: false,
                        text: props.ant.phone_number,
                        dbLink: {
                            table: 'sensor',
                            id: props.ant.id,
                            field: 'phone_number'
                        },
                        onChange: props.onChange
                    })
                ),
                React.DOM.li({className: 'quipu'},
                    React.DOM.div({}, 'Quipu Status'),
                    React.DOM.div({}, props.ant.quipu_status),
                    React.DOM.div({}, props.ant.signal) // Pas de signal ???
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
