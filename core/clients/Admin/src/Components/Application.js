'use strict';

var React = require('react');
var Immutable = require('immutable');
var Creator = React.createFactory(require('./Creator.js'));
var Place = React.createFactory(require('./Place.js'));
var PlaceOrphan = React.createFactory(require('./PlaceOrphan.js'));
var Sensor = React.createFactory(require('./Sensor.js'));
var CommandManager = React.createFactory(require('./CommandManager.js'));

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
    })
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
    }),
    onChangePlace: function(),
    onChangeSensor: function(),
    onCreatePlace: function(),
    onDeletePlace: function(),
    sendCommand: function()
}
interface AppState{
    selectedAntSet: Set(antId)
}

*/

var App = React.createClass({
    displayName: 'App',
    
    getInitialState: function(){
        return {
            selectedAntSet: new Set()
        };
    },

    updateAntSelection: function(antId){

        var selectedAntSet = this.state.selectedAntSet;
        
        if (selectedAntSet.has(antId))
            selectedAntSet.delete(antId);
        else
            selectedAntSet.add(antId);

        this.setState({
            selectedAntSet: selectedAntSet
        });
    },

    clearAntSelection: function(){
        this.setState({
            selectedAntSet: new Set()
        });
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', this.state);


        // Initializing sensorIDSet
        var antIDList = [];
        var placeIDList = [];

        props.sensorMap.forEach(function (sensor){
            antIDList.push(sensor.id);
        });

        var antIDset = new Immutable.Set(antIDList.sort(function(a, b){
            return a - b;
        }));

        // Creating Place panel
        var myPlaces = [];
        var myPlacesOrphan = [];

        props.placeMap.forEach(function (place) {

            placeIDList.push({'id' : place.id, 'name' : place.name}); // for DisplaySensor
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
                    selectedAntSet: state.selectedAntSet,
                    onChangePlace: props.onChangePlace,
                    onChangeSensor: props.onChangeSensor,
                    onSelectedAnts: self.updateAntSelection,
                    onDeletePlace: props.onDeletePlace
                }));
            }
            else {
                // console.log('PlacesOrphan', place)
                myPlacesOrphan.push(new PlaceOrphan ({
                    key: place.id,
                    place: place,
                    antIDset: antIDset,
                    onChangePlace: props.onChangePlace,
                    onChangeSensor: props.onChangeSensor,
                    onDeletePlace: props.onDeletePlace
                }));
            }
        });

        // Initializing placeIDMap (name => id)
        var temp = {};
        placeIDList.forEach(function (placeID) {
            temp[placeID.name] = placeID.id;
        })

        var placeIDMap = new Immutable.Map(temp);
    

        // Creating Sensor panel
        var allSensors = [];

        // /!\ JE N ARRIVE PAS A SORT PAR NOM DE RC
        // placeIDList.sort(function(a, b){
        //     return a.name - b.name;
        // })

        props.sensorMap.forEach(function (sensor) {
            var place = props.placeMap.get(sensor.installed_at);

            var placeName = place ? place.name : null;
            var placeId = place ? place.id : null;

            allSensors.push(new Sensor ({
                key: sensor.id,
                sensor: sensor,
                placeName: placeName,
                placeId: placeId,
                placeIDMap: placeIDMap.delete(placeName),
                onChangePlace: props.onChangePlace,
                onChangeSensor: props.onChangeSensor
            }));
        });

        // Creating Command Typer
        var selectedAntMap = new Map();
        state.selectedAntSet.forEach(function(id){
            selectedAntMap.set(id, props.sensorMap.get(id).name);
        });

        var commandTyper = new CommandManager({
            antMap: selectedAntMap,
            isOpen: state.selectedAntSet.size > 0,
            clearSelection: this.clearAntSelection,
            sendCommand: function(command){
                props.sendCommand(command, state.selectedAntSet);
            }
        });

        return React.DOM.div({id: 'myApp'},
            React.DOM.div({id: 'placePanel'}, 
                new Creator ({
                    onCreatePlace: props.onCreatePlace
                }),
                myPlaces,
                myPlacesOrphan
            ),
            React.DOM.div({id: 'sensorPanel'}, 
                allSensors
            ),
            commandTyper
        );
    }
});

module.exports = App;
