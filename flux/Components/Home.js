'use strict';

var React = require('react');

// COMPONENTS
var HomeButton = React.createFactory(require('../Components/HomeButton.js'));

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');

// CONSTANTS
var homeViewTypes = require('../Constants/constants.js').homeViewTypes;

/*

interface HomeProps{
}
interface HomeState{
    view: string
}

*/

function getStateFromStores() {
    return {
        view: DisplayedItemStore.getDisplayedView()
    };
}

var Home = React.createClass({

    displayName: 'Home',

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
        var state = this.state;

        var searchBar = "Barre de recherche";

        var view;

        switch(state.view){

            case homeViewTypes.SEARCH_RCS:
                break;

            // case homeViewTypes.RC_DETAILS:

            // case homeViewTypes.SEARCH_ADS:

            // case homeViewTypes.POST_AD:

            default:
                var buttons = [
                    new HomeButton(),
                    "Annonces",
                    "Publier"
                ];

                view = React.DOM.div({},
                    searchBar,
                    buttons
                );
                break;

        }
        
        return React.DOM.div({id: 'home'},
            view
        );
    },

    onChange: function() {
        this.setState(getStateFromStores());
    }
});

module.exports = Home;
