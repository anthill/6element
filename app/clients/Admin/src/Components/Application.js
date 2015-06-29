'use strict';

var React = require('react');
// var Tabs = React.createFactory(require('./Tabs.js'));
// var TabContent = React.createFactory(require('./TabContent.js'));
var Ant = React.createFactory(require('./Ant.js'));

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

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);

        var myAnts = [];

        props.ants.forEach(function(ant){
            myAnts.push(new Ant({ant: ant}));
        });
        
        return React.DOM.div({id: 'myApp'},
            myAnts
        );
    }
});

module.exports = App;
