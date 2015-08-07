'use strict';

var React = require('react');

/*

interface SelectorProps{
    currentSensorId: int
    isOpen: bool,
    setOpen: function()
}
interface SelectorState{

}


*/

var Display_sensor_id = React.createClass({
    displayName: 'Display_sensor_id',


    render: function() {
        // var self = this;
        var props = this.props;
        // var state = this.state;

        // console.log('Display_sensor_id props', props);
        // console.log('Display_sensor_id state', state);

        return React.DOM.div({className: 'display_sensor_id',
            onClick: function(){
                    console.log('onclick Display_sensor_id', props.currentSensorId);
                    // props.onChangeSensor()
                    props.setOpen(!props.isOpen);
                }
            },
            props.currentSensorId
        );
    }
});

module.exports = Display_sensor_id;
