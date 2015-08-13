'use strict';

var React = require('react');

/*

interface AntPickerProps{
    antFromNameMap: Map(name -> antID),
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

        // console.log('AntPicker props', props);
        // console.log('AntPicker state', state);

        var lis = [];
        props.antFromNameMap.forEach(function (antId, antName) {
            var objDb;
            // To build different database request
            // If currentSensorId is NULL ==> Add a sensor to an orphan Place
            // If currentSensorId is not NULL ==> Add a sensor to a place (who had already a sensor)
            //                                    Transform a place to an orphan plance (with no sensor)
            if (props.currentSensorId) {
                objDb = [{
                        'field': "installed_at",
                        'id': antId,
                        'value': props.currentPlaceId
                    },
                    {
                        'field': "installed_at",
                        'id': props.currentSensorId,
                        'value': null
                    }];
            }
            else {
                objDb = [{
                    'field': "installed_at",
                    'id': antId,
                    'value': props.currentPlaceId
                }];
            }

            lis.push(React.DOM.li({
                    key: antId,
                    className: 'clickable',
                    onClick: function(){
                        props.onChange(objDb);
                    }
                }, antName
            ));
        });

        return React.DOM.div({className: 'ant-picker'},
            lis
        );
    }
});

module.exports = AntPicker;
