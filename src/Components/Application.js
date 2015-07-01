'use strict';

var React = require('react');
var Levels = React.createFactory(require('./Levels.js'));

var formatHour = require('../utils.js').formatHour;
var formatDay = require('../utils.js').formatDay;
var levelCalc = require('../utils.js').levelCalc;
var isItOpen = require('../utils.js').isItOpen;

var crowdMoment = require('../utils.js').crowdMoment;

/*

interface AppProps{
    rcFake: {}
}
interface AppState{
}

*/

var App = React.createClass({
    displayName: 'App',

    /*getInitialState: function(){
        };
    },*/
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);
        
        //DATE
        var now = new Date ();
        var week = ['lundi', 'mardi', 'mercredi', 'jeudi' , 'vendredi', 'samedi', 'dimanche' ];
        var months = [ "janvier", "février", "mars", "avril", "mai", "juin",
                          "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        var dayName = week[now.getDay()-1];
        var dayNum = now.getDate();
        var monthName = months[now.getMonth()];
        var hour = now.getHours();
        var min = now.getMinutes();
        var hourmin= parseInt((hour.toString() + min.toString()));
        

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
        
        var open = isItOpen([dayName,hourmin], props.rcFake.schedule) ? "ouvert": "fermé" ;
        
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
        var len = props.rcFake.crowd.length;
        var waitingLevelNow = open? levelCalc(props.rcFake.maxSize, crowdMoment(Date.parse(now), props.rcFake.crowd)) : undefined;
        var crowd = React.DOM.div({}, 
            React.DOM.h2({}, "Attente"),
            React.DOM.div({}, waitingLevelNow),
            levels
        );
        var levels = new Levels({
            crowd: props.rcFake.crowd,
            maxSize: props.rcFake.maxSize
        });
        
        //============================================================================================
        
        // WASTE
        
        var wastes = {
            unavaiable : [],
            avaiable : []        
        };  // sort bins unavaiable / avaiable
        
        var wasteList;
        
        for (var waste in props.rcFake.wastes) {
            if (props.rcFake.wastes[waste]["status"] === "unavaiable") { 
                wastes.unavaiable.push(props.rcFake.wastes[waste]["type"]);
            }
            else {
                wastes.avaiable.push(props.rcFake.wastes[waste]["type"]);   
            }
        }
        
        var lis =[];
        var lisAlert = [] ;
        
        for (var status in wastes){    
            for (var index in wastes[status]){
                var li = React.DOM.li({},
                    React.DOM.div({}, wastes[status][index]),
                    React.DOM.div({}, status)
                );
                                      
                if (status === "unavaiable") {
                    var liAlert = React.DOM.li({},
                    React.DOM.div({}, wastes[status][index])); 
                                        
                    lisAlert.push(liAlert); 
                }
                
                 
                lis.push(li);
                                                 
            }
        }
        
        var wasteList = React.DOM.div({},
                                      React.DOM.h2({}, "Déchets"),
                                      React.DOM.ul({}, lis)
                            );
        var alert = React.DOM.div({},
                                 React.DOM.h2({}, "Alerte"),
                                 React.DOM.ul({}, lisAlert)
                                 );
            
        //============================================================================================
        
        // LOCALISATION
        
        
        
        //############################################################################################
        
        // ALL
        return React.DOM.div({id: 'myApp'},
                            header,
                            wastes["unavaiable"] ? alert : undefined,
                            schedule,
                            crowd,
                            wasteList,
                            levels
                            );
    }
});

module.exports = App;
