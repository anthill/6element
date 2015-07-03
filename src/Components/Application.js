'use strict';

var React = require('react');
var Levels = React.createFactory(require('./Levels.js'));

var formatHour = require('../utils.js').formatHour;
var formatDay = require('../utils.js').formatDay;
var levelCalc = require('../utils.js').levelCalc;
var isItOpenNow = require('../utils.js').isItOpenNow;
var crowdMoment = require('../utils.js').crowdMoment;
var displaySchedule = require('../utils.js').displaySchedule;


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
        
        // 
        var now = new Date ();
        var week = ['lundi', 'mardi', 'mercredi', 'jeudi' , 'vendredi', 'samedi', 'dimanche' ];
        var months = [ "janvier", "février", "mars", "avril", "mai", "juin",
                          "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        var dayName = week[now.getDay()-1];
        var dayNum = now.getDate();
        var monthName = months[now.getMonth()];
        var hour = now.getHours();
        var min = now.getMinutes();
        var hourmin = parseInt((hour.toString() + min.toString()));
        
        

        //=========================================================================================
        
        //HEADER
        
        var name = props.rcFake.name;
        var fav = props.rcFake.favourite ? "*" : "";
                          
        var header = React.DOM.h1({}, 
                            React.DOM.div({}, fav),
                            React.DOM.div({}, name)
                        );
        //============================================================================================
        
        
        // SCHEDULE
        
        //Has to be the same opening hour every day
        //Only work if closing days are monday and/or sunday
        
        var open = isItOpenNow(now, props.rcFake.schedule);
        
        var timetable = "";//for the moment, consider that timetable is the same every day. 
        
        var openMessage;
        
        var openDayMessage = displaySchedule(week,props.rcFake.schedule);     
        
    
        open ?  openMessage = React.DOM.div({className : 'greenText'}, "Ouvert"):
                openMessage = React.DOM.div({className : 'redText'}, "Fermé");
        
        timetable = formatDay(props.rcFake.schedule[0]);
        var schedule = React.DOM.div({}, [
                                     React.DOM.h2({}, "Horaires"),
                                     openMessage,
                                     React.DOM.div({}, openDayMessage), 
                                     //don't consider that RC could close for lunch
                                     React.DOM.div({}, timetable)
                                     ]);
        
        //============================================================================================
        
        // CROWD
        var len = props.rcFake.crowd.length;/*
        var crowdMoment = crowdMoment(Date.parse(now), props.rcFake.crowd);*/
        var waitingLevelNow = open? levelCalc(props.rcFake.maxSize, crowdMoment(Date.parse(now), props.rcFake.crowd).value) : undefined;
        
        var waitingMessages = [["green","<5mn"], ["yellow","5mn<*<15mn"],["orange", ">15mn"]];
             
        var legendColor = waitingMessages.map(function(level){
            return React.DOM.div({className : 'inline'},
                React.DOM.div({className : 'inline colorBlock '+level[0]+ 'Font'}),
                React.DOM.div({className : 'inline '+level[0]+ 'Text'}, level[1]))
        });
        
        var legendNow = React.DOM.div({className : 'inline'},
            React.DOM.div({className : 'inline colorBlock border'}),
            React.DOM.div({className : 'inline'}, 'maintenant'));
        
        var legend= React.DOM.div({className : 'inline'}, 
            legendColor, 
            legendNow);
                                                    
        
        var crowdPrediction = new Levels({
            crowd: props.rcFake.crowd,
            maxSize: props.rcFake.maxSize,
            waitingMessages : waitingMessages,
            now : now
        });
        
        var crowd = React.DOM.div({}, 
            React.DOM.h2({}, "Attente"),
            open ? React.DOM.div({className : waitingMessages[waitingLevelNow][0]+'Text'}, waitingMessages[waitingLevelNow][1]) : undefined,
            React.DOM.div({}, legend),
            crowdPrediction
        );
  
        
        //============================================================================================
        
        // WASTE
        
        var wastes = {
            unavaiable : [],
            avaiable : []        
        };  // sort bins unavaiable / avaiable
        
        var wasteList;
        
        props.rcFake.wastes.forEach(function(waste){
            if (waste.status==="unavaiable") { 
                wastes.unavaiable.push(waste.type);
            }
            else {
                wastes.avaiable.push(waste.type);   
            }
        });
        
        var lis = [];
        
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
        
        var alert = React.DOM.div({className : 'redText'},
            React.DOM.h2({}, "Alerte"),
            React.DOM.ul({}, lisAlert)
            );
            
        //============================================================================================
        
        // LOCALISATION
        
        var localisation = React.DOM.div({},
            React.DOM.div({}, "adresse : ", props.rcFake.address),
            React.DOM.div({}, 
                          "latitude : ", props.rcFake.coords.lat,
                          "longitude: ", props.rcFake.coords.long),
            React.DOM.div({}, "téléphone : ", props.rcFake.phone)
        );
        
        //############################################################################################
        
        // ALL
        return React.DOM.div({id: 'myApp'},
                            header,
                            wastes["unavaiable"] ? alert : undefined,
                            schedule,
                            crowd,
                            wasteList,
                            localisation
                            );
    }
});

module.exports = App;
