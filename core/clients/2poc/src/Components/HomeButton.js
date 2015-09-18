'use strict';

var React = require('react');

// COMPONENTS

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');

// CONSTANTS


/*

interface HomeButtonProps{
}
interface HomeButtonState{
    view: string
}

*/

function getStateFromStores() {
    return {
        view: DisplayedItemStore.getDisplayedView()
    };
}

var HomeButton = React.createClass({

    displayName: 'HomeButton',

    getInitialState: function(){
        return getStateFromStores();
    },

    componentDidMount: function() {
        // DisplayedItemStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        // DisplayedItemStore.removeChangeListener(this.onChange);
    },
    
    render: function() {
        // var state = this.state;
        var view = "i'm the view";
        
        return React.DOM.div({className: 'home-button'},
            view
        );
    },

    onChange: function() {
        this.setState(getStateFromStores());
    }
});

module.exports = HomeButton;
