'use strict';

var React = require('react');

/*
interface Rcs Props{
    selectedRc : integer
}
interface Rcs State{
}
*/


var RcContent = React.createClass({
	displayName: 'RcContent',

    render: function() {

        var text = this.props.selectedRc === 0 ? 'Je suis dans la première déchetterie' : 'Je suis dans une autre';

        return React.DOM.div({}, text);
    }
});


module.exports = RcContent;