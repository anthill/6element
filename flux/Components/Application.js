'use strict';

var React = require('react');

// COMPONENTS
var Tab = React.createFactory(require('./Tab.js'));
var Home = React.createFactory(require('../Components/Home.js'));
var Activity = React.createFactory(require('../Components/Activity.js'));

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');

// CONSTANTS
var tabTypes = require('../Constants/constants.js').tabTypes;

/*

interface AppProps{
}
interface AppState{
    view: string
}

*/



function getStateFromStores() {
    return {
        view: DisplayedItemStore.getDisplayedTab()
    };
}

var Application = React.createClass({

    displayName: 'App',

    getInitialState: function(){
        return getStateFromStores();
    },

    componentDidMount: function() {
        DisplayedItemStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DisplayedItemStore.removeChangeListener(this.onChange);
    },
    
    render: function() {
        // var self = this;
        // var props = this.props;
        var state = this.state;

        var tabs = [
            new Tab({
                name: 'Accueil',
                type: tabTypes.HOME,
                key: 0
            }),
            new Tab({
                name: 'Activité',
                type: tabTypes.ACTIVITY,
                key: 1
            }),
            new Tab({
                name: 'Déchèteries',
                type: tabTypes.RECYCLING_CENTER,
                key: 2
            })
        ];

        var view;

        switch(state.view){
            case tabTypes.HOME:
                view = new Home();
                break;

            case tabTypes.ACTIVITY:
                view = new Activity();
                break;

            default:
                console.error('Unknown state.view', state.view, state);
                break;
        }
        
        return React.DOM.div({id: 'app'},
            React.DOM.div({className: 'tabs'}, tabs),          
            view
        );
    },

    onChange: function() {
        this.setState(getStateFromStores());
    }
});

module.exports = Application;
