'use strict';

var React = require('react');

// COMPONENTS
var Tab = React.createFactory(require('../Components/Tab.js'));
var RecyclingCenter = React.createFactory(require('../Components/RecyclingCenter.js'));

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
                name: 'Déchetteries',
                type: tabTypes.RC_DETAIL,
                key: 0
            }),
            new Tab({
                name: 'Carte',
                type: tabTypes.MAP,
                key: 1
            })
        ];

        var view;

        switch(state.view){
            case tabTypes.RC_DETAIL:
                view = new RecyclingCenter({id: 'recyclingCenter'});
                break;

            case tabTypes.MAP:
                view = 'Je suis la carte';
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
