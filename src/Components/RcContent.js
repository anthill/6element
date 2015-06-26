'use strict';

var React = require('react');

/*
interface Rcs Props{
    selectedRC : RC
}
interface Rcs State{
}
*/


var RcContent = React.createClass({
	displayName: 'RcContent',

    render: function() {
        
        console.log('RCCONTENT', this.props.selectedRC);
        
        return React.DOM.div({}, this.props.selectedRC.coords);
    }
});


module.exports = RcContent;