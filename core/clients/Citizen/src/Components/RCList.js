'use strict';

var React = require('react');

// STORES
var RecyclingCenterStore = require('../Stores/recyclingCenterStore.js');

// ACTIONS
var _changeRC = require('../Actions/recyclingCenterActions.js').changeRC;

/*

interface RCListProps{
}
interface RCListState{
    rcMap: Map (id => RecyclingCenter)
}

*/

function getStateFromStores() {
    return {
        rcMap: RecyclingCenterStore.getAll()
    };
}

var RCList = React.createClass({
    displayName: 'RCList',

    getInitialState: function(){
        return getStateFromStores();
    },

    componentDidMount: function() {
        RecyclingCenterStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        RecyclingCenterStore.removeChangeListener(this.onChange);
    },
    
    render: function() {
        var state = this.state;

        var classes = [
            'rc-list'
        ];
        
        var list = [];

        state.rcMap.forEach(function(rc, id){
            list.push(React.DOM.div({
                    className: 'item',
                    key: id,
                    onClick: function(){
                        _changeRC(id);
                    }
                },
                rc.name
            ))
        });

        return React.DOM.div({className: classes.join(' ')},
            list
        );
    },

    onChange: function() {
        this.setState(getStateFromStores());
    }
});

module.exports = RCList;
