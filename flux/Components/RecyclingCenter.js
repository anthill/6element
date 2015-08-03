'use strict';

var React = require('react');

// COMPONENTS
var RCList = React.createFactory(require('../Components/RCList.js'));

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');
var RecyclingCenterStore = require('../Stores/recyclingCenterStore.js');

// ACTIONS
var _toggleRCList = require('../Actions/displayActionCreator.js').toggleRCList;

/*

interface RecyclingCenterProps{
}
interface RecyclingCenterState{
    isListOpen: boolean,
    recyclingCenter: Recycling Center
}

*/

function getStateFromStores() {
    return {
        isListOpen: DisplayedItemStore.isRCListOpen(),
        recyclingCenter: RecyclingCenterStore.getSelected()
    };
}

var RecyclingCenter = React.createClass({
    displayName: 'RecyclingCenter',

    getInitialState: function(){
        return getStateFromStores();
    },

    componentDidMount: function() {
        DisplayedItemStore.addChangeListener(this.onChange);
        RecyclingCenterStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DisplayedItemStore.removeChangeListener(this.onChange);
        RecyclingCenterStore.removeChangeListener(this.onChange);
    },
    
    render: function() {
        var state = this.state;

        var classes = [
            'recyclingCenter'
        ];

        var name = React.DOM.div({
                className: 'name',
                onClick: _toggleRCList
            },
            state.recyclingCenter.name
        );

        var list = state.isListOpen ? new RCList({}) : undefined;
        
        return React.DOM.div({
                className: classes.join(' ')
            },
            name,
            list,
            state.recyclingCenter.coords.lon,
            state.recyclingCenter.coords.lat
        );
    },

    onChange: function() {
        // Maybe differentiate based on what really needs to be changed
        this.setState(getStateFromStores());
    }
});

module.exports = RecyclingCenter;
