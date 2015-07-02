'use strict';

var React = require('react');
var Detail = React.createFactory(require('./Detail.js'));


/*

interface PanelProps{
    recyclingCenterMap: Map ( id => RecyclingCenter )
}
interface PanelState{

}

*/

var Panel = React.createClass({

    getInitialState: function(){
        return {}
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('PANEL props', props);

        var classes = '';

        var details = [];

        var closeButton = React.DOM.div({
            id: "close-button",
            onClick: function(){
                document.getElementById('panel').classList.toggle('open');
            }
        });

        if (props.recyclingCenterMap){
            if (props.recyclingCenterMap.size > 0)
                classes = 'open';

            props.recyclingCenterMap.forEach(function (rc){
                details.push(new Detail({
                    recyclingCenter: rc
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
