'use strict';

var React = require('react');
var Detail = React.createFactory(require('./Detail.js'));


/*

interface PanelProps{
    placeMap: Map ( id => Place ),
    day: string
}

*/

var Panel = React.createClass({

    getInitialState: function(){
        return {}
    },

    render: function() {
        //var self = this;
        var props = this.props;

        // console.log('PANEL props', props);

        var classes = '';

        var details = [];

        var closeButton = React.DOM.div({
            id: "close-button",
            onClick: function(){
                document.getElementById('panel').classList.toggle('open');
            }
        });

        if (props.placeMap){
            if (props.placeMap.size > 0)
                classes = 'open';

            props.placeMap.forEach(function (rc){
                details.push(new Detail({
                    place: rc,
                    day : props.day
                }));
            });
        }
        
        return React.DOM.div({
                id: 'panel',
                className: classes
            },
            [
                React.DOM.h1({}, 'Affluence en direct'),
                closeButton,
                details
            ]
        );
    }
});

module.exports = Panel;
