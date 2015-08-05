'use strict';

var React = require('react');

// COMPONENTS
var AdPost = React.createFactory(require('./AdPost.js'));

var Home = React.createFactory(require('./Home.js'));
var Tab = React.createFactory(require('./Tab.js'));
var Activity = React.createFactory(require('./Activity.js'));
var RecyclingCenter = React.createFactory(require('./RecyclingCenter.js'));

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');

// CONSTANTS
var K = require('../Constants/constants.js');
var tabTypes = K.tabTypes;

/*

interface AppProps{
}
interface AppState{
    view: string
}

*/

function getStateFromStores() {
    return {
        screen: DisplayedItemStore.getActiveScreen(),
        tab: DisplayedItemStore.getDisplayedTab()
    };
}

var Application = React.createClass({

    displayName: 'App',

    getInitialState: function(){
        return getStateFromStores();
    },

    onTabChange: function() {
        this.setState(getStateFromStores());
    },

    componentDidMount: function() {
        DisplayedItemStore.on(DisplayedItemStore.events.CHANGE_TAB, this.onTabChange);
    },

    componentWillUnmount: function() {
        DisplayedItemStore.removeListener(DisplayedItemStore.events.CHANGE_TAB, this.onTabChange);
    },
    
    render: function() {
        // var self = this;
        // var props = this.props;
        var state = this.state;

        console.log('APP state', state);

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

        var screen;        
        
        switch(state.screen){
            case K.screen.MAIN:
                screen = new AdPost();
                
                var tab;
                
                switch(state.tab){
                    case tabTypes.HOME:
                        tab = new Home();
                        break;

                    case tabTypes.ACTIVITY:
                        tab = new Activity();
                        break;

                    case tabTypes.RECYCLING_CENTER:
                        tab = new RecyclingCenter({className: 'RC'});
                        break;

                    default:
                        console.error('Unknown state.tab', state.tab, state);
                        break;
                }
                
                screen = [
                    React.DOM.div({className: 'tabs'}, tabs),
                    tab
                ];
                
                break;
            case K.screen.AD_POST:
                screen = new AdPost();
                break;
            default:
                console.error('Unknown state.screen', state.screen, state);

        }
        
        
        return React.DOM.div({id: 'app'}, screen);
    }
});

module.exports = Application;
