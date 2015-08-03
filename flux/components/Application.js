'use strict';

var React = require('react');

// COMPONENTS
var Tab = React.createFactory(require('../Components/Tab.js'));
var Home = React.createFactory(require('../Components/Home.js'));

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
                name: 'Home',
                type: tabTypes.HOME,
                key: 0
            }),
            new Tab({
                name: 'Mes Annonces',
                type: tabTypes.MY_ADS,
                key: 1
            }),
            new Tab({
                name: 'Mes Messages',
                type: tabTypes.MY_MSGS,
                key: 2
            })
        ];

        var view;

        switch(state.view){
            case tabTypes.HOME:
                view = new Home({id: 'recyclingCenter'});
                break;

            case tabTypes.MY_ADS:
                view = 'Je suis la section contenant vos annonces';
                break;

            case tabTypes.MY_MSGS:
                view = 'Je suis la section contenant vos messages';
                break;

            default:
                console.log('ERROR');
                break;
        }
        
        return React.DOM.div({id: 'app'},
            tabs,
            view
        );
    },

    onChange: function() {
        this.setState(getStateFromStores());
    }
});

module.exports = Application;
