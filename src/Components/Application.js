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
var currentUserStore = require('../Stores/currentUserStore.js');

// CONSTANTS
var tabTypes = require('../Constants/tabTypes.js');
var screenTypes = require('../Constants/screenTypes.js');

/*

interface AppProps{
}
interface AppState{
    view: string
}

*/

function makeStateFromStores() {
    return {
        screen: DisplayedItemStore.getActiveScreen(),
        tab: DisplayedItemStore.getDisplayedTab()
    };
}

var Application = React.createClass({

    displayName: 'App',

    getInitialState: function(){
        return makeStateFromStores();
    },

    onTabChange: function() {
        this.setState(makeStateFromStores());
    },

    onScreenChange: function() {
        this.setState(makeStateFromStores());
    },

    componentDidMount: function() {
        DisplayedItemStore.on(DisplayedItemStore.events.CHANGE_TAB, this.onTabChange);
        DisplayedItemStore.on(DisplayedItemStore.events.CHANGE_SCREEN, this.onScreenChange);
    },

    componentWillUnmount: function() {
        DisplayedItemStore.removeListener(DisplayedItemStore.events.CHANGE_TAB, this.onTabChange);
        DisplayedItemStore.removeListener(DisplayedItemStore.events.CHANGE_SCREEN, this.onScreenChange);
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
            }),
            React.DOM.input({
                defaultValue: currentUserStore.get() || '',
                onBlur: function(e){
                    currentUserStore.changeUser(e.target.value);
                }
            })
        ];

        var screen;        
        
        switch(state.screen){
            case screenTypes.MAIN:
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
            case screenTypes.AD_POST:
                screen = new AdPost();
                break;
            default:
                console.error('Unknown state.screen', state.screen, state);

        }
        
        
        return React.DOM.div({id: 'app'}, screen);
    }
});

module.exports = Application;
