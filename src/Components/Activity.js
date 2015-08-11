"use strict";

var React = require('react');

// COMPONENTS
var ActivityItem = React.createFactory(require('./ActivityItem.js'));

// STORES
var TrocStore = require('../Stores/trocStore.js');
var TrocFilterStore = require('../Stores/trocFilterStore.js');
var currentUserStore = require('../Stores/currentUserStore.js');


// ACTIONS
var trocActions = require('../Actions/trocActions.js');


// UTILS

/*

interface ActivityProps{
}
interface ActivityState{
    trocs: [{
        id: integer,
        myAd: integer,
        links: [
            {
                userId: integer,
                adId: integer,
                state: string
            }
        ],
        direction: string,
        state: string
    }]
}

*/

function getStateFromStores() {
    return {
        trocs: TrocStore.getFromCurrentFilters(),
        trocFilters: TrocFilterStore.getFilterState()
    };
}

module.exports = React.createClass({

    displayName: 'Activity',

    getInitialState: function(){
        return getStateFromStores();
    },

    componentDidMount: function() {
        TrocStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        TrocStore.removeChangeListener(this.onChange);
    },

    onChange: function() {
        this.setState(getStateFromStores());
    },
    
    render: function() {
        //var self = this;
        //var props = this.props;
        var state = this.state;
        
        var switchButtons = React.DOM.div({className: 'filter'},
            React.DOM.label({className: 'give'},
                'Je me sépare',
                React.DOM.input({
                    type: 'checkbox',
                    value: 'give',
                    name: 'directions',
                    defaultChecked: state.trocFilters.directions.has('GIVE'),
                    onChange: function(){
                        trocActions.applyTrocFilter('directions', 'GIVE');
                    }
                })
            ),
            React.DOM.label({className: 'need'},
                'Je récupère',
                React.DOM.input({
                    type: 'checkbox',
                    value: 'need',
                    name: 'directions',
                    defaultChecked: state.trocFilters.directions.has('NEED'),
                    onChange: function(){
                        trocActions.applyTrocFilter('directions', 'NEED');
                    } 
                })
            )
        ); // => will be able to trigger filter Action

        var searchField = React.DOM.form({},
            React.DOM.input({
                type: 'search',
                id: 'search',
                placeholder: 'Recherche'
            })    
        ); // => will be able to trigger filter Action

        var trocList = React.DOM.ol({className: "activity-items"}, 
            state.trocs
                .filter(function(t){
                    return t.myAd.creator === currentUserStore.get()
                })
                .map(function(troc){
                    return new ActivityItem(Object.assign(troc, {
                        key: troc.id
                    }));
                })
        ); 

        return React.DOM.div({className: 'activity'},
            switchButtons,
            searchField,
            trocList
        );
    }
});
