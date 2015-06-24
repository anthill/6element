'use strict';

var React = require('react');

/*
interface Tab Props{
    selectedTab : integer
}
interface Tab State{
}
*/


var TabContent = React.createClass({
	displayName: 'TabContent',

    render: function() {

        var text = this.props.selectedTab === 0 ? 'Je suis dans la partie 1' : 'Je suis dans la partie 2';

        return React.DOM.div({}, text);
    }
});


module.exports = TabContent;