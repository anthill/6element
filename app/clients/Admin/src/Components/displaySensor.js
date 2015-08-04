'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));


/*
interface placeProps{	
	Sensors: [{
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
	}],
	orpha: bool
    onChangeSensor: function()
}

interface AppState{
}

*/


var DisplaySensor = React.createClass({
    displayName: 'DisplaySensor',

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('DISPLAYSENSOR props', props);
        console.log('DISPLAYSENSOR state', state);

        var classes = [
            'sensor'
            // isSelected ? 'selected' : '',
            // props.ant.isUpdating ? 'updating' : '',
            // props.ant.quipu_status,
            // props.ant.sense_status
        ];

        return React.DOM.div({className: classes.join(' ')},
            
            React.DOM.ul({},

            	React.DOM.li({}, 
                    React.DOM.div({}, 'Name'),
                    // React.DOM.div({}, props.ant.id)
                    new Modifiable({
                        className: 'DisplaySensorName',
                        isUpdating: false,
                        text: props.sensor.name,
                        dbLink: {
                            id: props.sensor.id,
                            field: 'name'
                        },
                        onChange: props.onChangeSensor,
                    })
                ),
                React.DOM.li({}, 
                    React.DOM.div({}, 'Phone'),
                    new Modifiable({
                        className: 'DisplaySensorPhone_number',
                        isUpdating: false,
                        text: props.sensor.phone_number,
                        dbLink: {
                            id: props.sensor.id,
                            field: 'phone_number'
                        },
                        onChange: props.onChangeSensor
                    })
                )
            )
        )
    }
});

module.exports = DisplaySensor;