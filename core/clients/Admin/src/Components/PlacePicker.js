'use strict';

var React = require('react');

/*

interface PlacePickerProps{
    placeIDMap: Map(),
    placeId: int,
    sensorId: int,
    currentPlaceId: int,
    isOpen: bool,
    onChange: function()
}
interface PlacePickerState{
}

*/

var PlacePicker = React.createClass({
    displayName: 'PlacePicker',

    render: function() {
        // var self = this;
        var props = this.props;
        // var state = this.state;

        // console.log('PlacePicker props', props);
        // console.log('PlacePicker state', state);

        var listID = [];

        if (props.isOpen) {
            var lis = [];
            props.placeIDMap.forEach(function (value, key) {

                var objDb = [{
                    'field': "installed_at",
                    'id': props.sensorId,
                    'value': value
                }];
                
                lis.push(React.DOM.li({
                        key: key,
                        onClick: function(){
                            props.onChange(objDb)
                        }
                    },
                    key
                ));
            });
            listID = React.DOM.ul({}, lis);
        }

        return React.DOM.div({className: 'place-selector'},
            listID
        );
    }
});

module.exports = PlacePicker;
