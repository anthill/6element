'use strict';

var React = require('react');

/*

interface SelectorProps{
    placeIDMap: Map(),
    placeId: int,
    sensorId: int,
    currentPlaceId: int,
    isOpen: bool,
    onChange: function(),
    setOpen: function()
}
interface SelectorState{
}

*/

var SelectorPlaceId = React.createClass({
    displayName: 'SelectorPlaceId',

    render: function() {
        // var self = this;
        var props = this.props;
        // var state = this.state;

        console.log('SelectorPlaceId props', props);
        // console.log('SelectorPlaceId state', state);

        var listID = [];

        if (props.isOpen) {
            var lis = [];
            props.placeIDMap.forEach(function (value, key) {
                var objDb = [];
                objDb = [{
                            'field': "installed_at",
                            'id': props.sensorId,
                            'value': value
                        }]
                
                lis.push(React.DOM.li({
                    key: key,
                    onClick: function(){
                        console.log('onclick listID_place', key);
                        props.onChange(objDb);
                        props.setOpen(!props.isOpen);
                        }
                    },
                    key
                    )
                );
            });
            listID = React.DOM.ul({}, lis);
        }

        return React.DOM.div({className: 'listIDPlace'},
            listID
        );
    }
});

module.exports = SelectorPlaceId;
