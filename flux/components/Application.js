'use strict';

var React = require('react');

// COMPONENTS
var Tab = React.createFactory(require('../Components/Tab.js'));

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');

var constants = require('../Constants/constants.js');

/*

interface AppProps{
}
interface AppState{
    view: string
}

*/

var tabTypes = constants.tabTypes;

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
        DisplayedItemStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        DisplayedItemStore.removeChangeListener(this._onChange);
    },
    
    render: function() {
        // var self = this;
        // var props = this.props;
        var state = this.state;

        var tabs = [
            new Tab({
                name: 'Déchetteries',
                type: tabTypes.RC_DETAIL
            }),
            new Tab({
                name: 'Carte',
                type: tabTypes.MAP
            })
        ];

        var view;

        switch(state.view){
            case tabTypes.RC_DETAIL:
                view = 'Je suis une déchetterie';
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

    _onChange: function() {
        this.setState(getStateFromStores());
    }
});

module.exports = Application;
