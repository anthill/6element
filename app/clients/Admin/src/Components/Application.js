'use strict';

var React = require('react');
var Tabs = React.createFactory(require('./Tabs.js'));
var TabContent = React.createFactory(require('./TabContent.js'));


/*

interface AppProps{
    ants: Map (id => ant{
        id: int,
        name: strint,
        latLng: {
            lat: float,
            long: float
        },
        ip: string,
        signal: int,
        registration: int,
        quipuStatus: string,
        6senseStatus: string
    });
}
interface AppState{
    selectedTab: int
}

*/

var App = React.createClass({
    displayName: 'App',

    getInitialState: function(){
        return {
            selectedTab: 0
        };
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);

        var tabs = new Tabs({
            tabNames: ['Tab1', 'Tab2'],
            selectedTab: state.selectedTab,
            onTabChange: function(index){
                self.setState(Object.assign(self.state, {
                    selectedTab: index
                }));
            }
        });

        var tabContent = new TabContent({
            selectedTab : state.selectedTab,
        });

        return React.DOM.div({id: 'myApp'},
            tabs,
            tabContent
        );
    }
});

module.exports = App;
