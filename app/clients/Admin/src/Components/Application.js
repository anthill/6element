'use strict';

var React = require('react');
// var Tabs = React.createFactory(require('./Tabs.js'));
// var TabContent = React.createFactory(require('./TabContent.js'));
var Ant = React.createFactory(require('./Ant.js'));
var Place = React.createFactory(require('./Place.js'));

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
    }),
    onChange: function()
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

        console.log('APP props', props);
        console.log('APP state', state);

        //var myAnts = [];
        var myPlaces = [];

        props.placeMap.forEach(function (place) {
            var mySensors = [];
            if (place.sensor_ids.length !== 0) {
                place.sensor_ids.forEach(function (sensor_id) {
                    mySensors.push(props.sensorMap.get(sensor_id));
                })
                myPlaces.push(new Place ({
                    place, place,
                    mySensors, mySensors,
                    onChange: props.onChange
                }));
            }
        });

        // props.sensorMap.forEach(function(ant){
        //     myAnts.push(new Ant({
        //         ant: ant,
        //         onChange: props.onChange
        //     }));
        // });
        
        return React.DOM.div({
            id: 'myApp'
        },
            myPlaces
        );
    }
});

module.exports = App;
