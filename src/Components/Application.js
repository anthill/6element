'use strict';

var React = require('react');
var formatHour = require('../utils.js').formatHour;
var formatDay = require('../utils.js').formatDay;

/*

interface AppProps{
    rcFake: {}
}
interface AppState{
    selectedRC: int
}

*/

var App = React.createClass({
    displayName: 'App',

    /*getInitialState: function(){
        return {
            selectedRC: undefined
        };
    },*/
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);

        
        /*var rcContent = new RcContent({
            selectedRC : props.rcs[state.selectedRC]
        });*/
        //=========================================================================================
        
        //HEADER
        
        var name = props.rcFake["name"];
        var fav = props.rcFake["favourite"] ? "*" : "";
                          
        var header = React.DOM.h1({}, 
                            React.DOM.div({}, fav),
                            React.DOM.div({}, name)
                        );
        //============================================================================================
        
        
        // SCHEDULE
        
        //Has to be the same opening hour every openDay
        //Only work if closing days are monday and/or sunday
        
        var open = props.rcFake["open"] ? "ouvert" : "fermé" ;
        var openDay = [];
        var timetable = "";//for the moment, consider that timetable is the same every openDay. 
        var firstDay="";
        
        for ( var dayIndex in props.rcFake.schedule)
        {
            if (props.rcFake.schedule[dayIndex][1]["start"]) //if a day has an opening hour, then the RC is opened on that day
            {   
                openDay.push(props.rcFake.schedule[dayIndex]); 
            }
        }
        
        timetable = formatDay(openDay[0]);
        var schedule = React.DOM.div({}, [
                                     React.DOM.h2({}, "Horaires"),
                                     React.DOM.div({}, open),
                                     React.DOM.div({}, openDay[0][0] + " - " + openDay[openDay.length - 1][0]), 
                                     //don't consider that RC could close for lunch
                                     React.DOM.div({}, timetable)
                                     ]);
        
        //============================================================================================
        
        // CROWD
        
        //============================================================================================
        
        // WASTE
        
        var wastes = {
            unavaiable : [],
            avaiable : []        
        };  // sort bins unavaiable / avaiable
        
        var wasteList;
        for (var waste in props.rcFake.wastes)
        {
            props.rcFake.wastes[waste]["status"] === "unavaiable" ? 
                wasteList.unavaiable.push(props.rcFake.wastes[waste]["type"]) :
                wasteList.avaiable.push(props.rcFake.wastes[waste]["type"]);                                       
        }
         var wasteList = React.DOM.div({}, wastes.map(function(waste){
                                                      return  React.DOM.div({}, [waste[type] + " : "]);
         };
            
        //============================================================================================
        
        // LOCALIATION
        
        //============================================================================================
        
        // ALL
        return React.DOM.div({id: 'myApp'},
                            header,
                            wastes.unavaiable ? alert : undefined,
                            schedule 
                            );
    }
});

module.exports = App;
