'use strict';

var React = require('react');

/*

interface SelectorProps{
    antIDSet: Set(antID),
    currentSensorId: int,
    currentPlaceId, int
    onClick: function(),
    onChangeSensor: function()
}
interface SelectorState{
}

*/

var Display_sensor_id = React.createClass({
    displayName: 'Selector_sensor_id',

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('Selector_sensor_id props', props);
        // console.log('Selector_sensor_id state', state);

        var listID = undefined;

        if (props.isOpen) {
            var lis = [];
            props.antIDset.forEach(function (antID) {
                console.log('antID', antID);
                lis.push(React.DOM.li({
                    onClick: function(){
                        console.log('onclick listID_sensor', antID);
                        props.onChange([{
                            'field': "installed_at",
                            'id': antID,
                            'value': props.currentPlaceId
                        },
                        {
                            'field': "installed_at",
                            'id': props.currentSensorId,
                            'value': null   
                        }
                        ]);
                        props.setOpen(!props.isOpen);
                    }
                },
                    antID
                )
                );
            });

            listID = React.DOM.ul({}, lis);
        }

        return React.DOM.div({className: 'listID_sensor'},
            listID
        );
    }
});

module.exports = Display_sensor_id;
