'use strict';

var React = require('react');

/*

interface PanelProps{
    recyclingCenter: RecyclingCenter
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

        console.log('panel props', props);
        
        return React.DOM.div({id: 'panel'}, [
            props.recyclingCenter ?
                React.DOM.h2({}, props.recyclingCenter.name + ' ' + props.recyclingCenter.details.length) :
                undefined
        ]);
    }
});

module.exports = Panel;
