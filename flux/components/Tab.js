'use strict';

var React = require('react');

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');

// ACTIONS
var displayActionCreator = require('../Actions/displayActionCreator.js');

/*

interface TabProps{
    name: string,
    type: string
}
interface TabState{
    content: string
}

*/

function getStateFromStores(type) {
    return {
        isActive: DisplayedItemStore.getDisplayedTab() === type
    };
}

var Tab = React.createClass({
    displayName: 'Tab',

    getInitialState: function(){
        return getStateFromStores(this.props.type);
    },

    componentDidMount: function() {
        DisplayedItemStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        DisplayedItemStore.removeChangeListener(this._onChange);
    },
    
    render: function() {
        var state = this.state;
        var props = this.props;

        var classes = [
            'tab',
            state.isActive ? 'active' : ''
        ];
        
        return React.DOM.div({
                className: classes.join(' '),
                onClick: this._onClick
            },
            props.name
        );
    },

    _onClick: function(){
        console.log('click', this.props.type);

        if (!this.state.isActive)
            displayActionCreator.changeTab(this.props.type);
    },

    _onChange: function() {
        this.setState(getStateFromStores(this.props.type));
    }
});

module.exports = Tab;
