'use strict';

var React = require('react');

/*

interface AntPickerProps{
    antIDSet: Set(antID),
    currentSensorId: int,
    currentPlaceId, int,
    onChangeSensor: function()
}
interface AntPickerState{
}

*/

var AntPicker = React.createClass({
    displayName: 'AntPicker',

    render: function() {
        // var self = this;
        var props = this.props;
        // var state = this.state;

        // console.log('Selector_sensor_id props', props);
        // console.log('Selector_sensor_id state', state);

        var listID = [];

        if (props.isOpen) {
            var lis = [];
            props.antIDset.forEach(function (antID) {
                var objDb = [];
                // To build different database request
                // If currentSensorId is NULL ==> Add a sensor to an orphan Place
                // If currentSensorId is not NULL ==> Add a sensor to a place (who had already a sensor)
                //                                    Transform a place to an orphan plance (with no sensor)
                if (props.currentSensorId) {
                    objDb = [{
                                'field': "installed_at",
                                'id': antID,
                                'value': props.currentPlaceId
                            },
                            {
                                'field': "installed_at",
                                'id': props.currentSensorId,
                                'value': null
                            }]
                }
                else {
                    objDb = [{
                                'field': "installed_at",
                                'id': antID,
                                'value': props.currentPlaceId
                            }]
                }

                lis.push(React.DOM.li({
                    key: antID,
                    onClick: function(){
                            console.log('onclick listID_sensor', antID);
                            props.onChange(objDb);
                        }
                    },
                    antID
                    )
                );
            });
            listID = React.DOM.ul({}, lis);
        }

        return React.DOM.div({className: 'ant-picker'},
            listID
        );
    }
});

module.exports = AntPicker;
