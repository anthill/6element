'use strict';

var React = require('react');
var Immutable = require('immutable');
var Place = React.createFactory(require('./Place.js'));
var PlaceOrphan = React.createFactory(require('./PlaceOrphan.js'));
var DisplaySensor = React.createFactory(require('./displaySensor.js'));

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
        //var self = this;
        var props = this.props;

        console.log('APP props', props);
        // console.log('APP state', state);

        var antIDList = [];
        var placeIDList = [];

        props.sensorMap.forEach(function (sensor){
            antIDList.push(sensor.id);
        });

        var antIDset = new Immutable.Set(antIDList.sort(function(a, b){
            return a - b;
        }));

        var myPlaces = [];
        var myPlacesOrphan = [];

        props.placeMap.forEach(function (place) {

            placeIDList.push({id : place.id, name : place.name}); // for DisplaySensor
            var mySensors = [];
            // console.log("place", place);
            if (place.sensor_ids.size !== 0) {
                place.sensor_ids.forEach(function (sensor_id) {
                    mySensors.push(props.sensorMap.get(sensor_id));
                });
                myPlaces.push(new Place ({
                    key: place.id,
                    place: place,
                    mySensors: mySensors,
                    antIDset: antIDset,
                    onChangePlace: props.onChangePlace,
                    onChangeSensor: props.onChangeSensor
                }));
            }
            else {
                // console.log('PlacesOrphan', place)
                myPlacesOrphan.push(new PlaceOrphan ({
                    key: place.id,
                    place: place,
                    antIDset: antIDset,
                    onChangePlace: props.onChangePlace,
                    onChangeSensor: props.onChangeSensor
                }));
            }
        });

        // For all sensor
        var allSensor = [];

        console.log("placeIDList", placeIDList);
        var placeIDList = new Immutable.List(placeIDList.sort(function(a, b){
            return a.id - b.id;
        }));
        console.log("placeIDList 2", placeIDList);

        props.sensorMap.forEach(function (sensor) {
            var place = props.placeMap.get(sensor.installed_at);

            var placeName = place ? place.name : null;
            var placeId = place ? place.id : null;

            allSensor.push(new DisplaySensor ({
                key: sensor.id,
                sensor: sensor,
                placeName: placeName,
                placeId: placeId,
                placeIDList: placeIDList,
                onChangePlace: props.onChangePlace,
                onChangeSensor: props.onChangeSensor
            }));
        });
        
        return React.DOM.div({id: 'myApp'},
            React.DOM.div({id: 'adminTool'}, 
                myPlaces,
                myPlacesOrphan
            ),
            React.DOM.div({id: 'panel'}, 
                allSensor
            )
        );
    }
});

module.exports = App;
