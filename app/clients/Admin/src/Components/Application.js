'use strict';

var React = require('react');
var Immutable = require('immutable');
// var Tabs = React.createFactory(require('./Tabs.js'));
// var TabContent = React.createFactory(require('./TabContent.js'));
var Ant = React.createFactory(require('./Ant.js'));
var Place = React.createFactory(require('./Place.js'));
var placeOrphan = React.createFactory(require('./placeOrphan.js'));

/*

interface AppProps{
    placeMap: Map (id => place{
        created_at: string,
        id: int,
        lat: int,
        lon: int,
        name: string,
        sensor_ids : list[],
        type, string,
        updated_at, string
        }
    sensorMap: Map (id => sensor{
        created_at: string,
        id: int,
        installed_at: int,
        isUpdating: bool,
        latest_input: string,
        latest_output: string
        name: string,
        phone_number: string,
        quipu_status: string,
        sense_status: string,
        updated_at: string
        }
    }),
    onChangePlace: function(),
    onChangeSensor: function()
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

        var antIDList = [];

        props.sensorMap.forEach(function (sensor){
            antIDList.push(sensor.id);
        });

        var antIDset = Immutable.Set(antIDList.sort(function(a, b){
            return a - b;
        }));

        var myPlaces = [];
        var myPlacesOrphan = [];

        props.placeMap.forEach(function (place) {
            console.log('place', place.name);
            var mySensors = [];
            if (place.sensor_ids.length !== 0) {
                place.sensor_ids.forEach(function (sensor_id) {
                    mySensors.push(props.sensorMap.get(sensor_id));
                });
                console.log('mySensors', mySensors);
                myPlaces.push(new Place ({
                    place: place,
                    mySensors: mySensors,
                    antIDset: antIDset,
                    onChangePlace: props.onChangePlace,
                    onChangeSensor: props.onChangeSensor
                }));
            }
            else {
                console.log('PlacesOrphan', place)
                myPlacesOrphan.push(new PlacesOrphan ({
                    place: place,
                    antIDset: antIDset,
                    onChangePlace: props.onChangePlace,
                    onChangeSensor: props.onChangeSensor
                }))
            }

        });
        
        return React.DOM.div({
            id: 'myApp'
        },
            myPlaces
        );
    }
});

module.exports = App;
