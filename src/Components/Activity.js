"use strict";

var React = require('react');

// COMPONENTS
var ActivityItem = React.createFactory(require('./ActivityItem.js'));

// STORES
var TrocStore = require('../Stores/trocStore.js');

// ACTIONS
var trocActions = require('../Actions/trocActionCreator.js');


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
        trocs: TrocStore.getFromCurrentFilters()
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
            React.DOM.label({},
                'Je me sépare',
                React.DOM.input({
                    type: 'checkbox',
                    id: 'give-away',
                    name: 'give-search',
                    onChange: function(){
                        trocActions.applyTrocFilter('direction', 'GIVE');
                    }
                })
            ),
            React.DOM.label({},
                'Je récupère',
                React.DOM.input({
                    type: 'checkbox',
                    id: 'search-for',
                    name: 'give-search',
                    onChange: function(){
                        trocActions.applyTrocFilter('direction', 'NEED');
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
            state.trocs.map(function(troc, index){
                return new ActivityItem(Object.assign(troc, {
                    key: index
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
