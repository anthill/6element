'use strict';

var React = require('react');
var Levels = React.createFactory(require('./Levels.js'));

var formatHour = require('../utils.js').formatHour;
var formatDay = require('../utils.js').formatDay;
var levelCalc = require('../utils.js').levelCalc;
var isItOpen = require('../utils.js').isItOpen;
var crowdMoment = require('../utils.js').crowdMoment;
var displaySchedule = require('../utils.js').displaySchedule;
var numDay = require('../utils.js').numDay;


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
        var week = ['lundi', 'mardi', 'mercredi', 'jeudi' , 'vendredi', 'samedi' , 'dimanche'];
        var months = [ "janvier", "février", "mars", "avril", "mai", "juin",
                          "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        var dayNum = numDay(now);
        var dayName = week[dayNum];
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
                
        var open = isItOpen(now, props.rcFake.schedule);
                
        var openMessage;
        
        var openDayMessage = displaySchedule(week,props.rcFake.schedule);     
        
    
        open ?  openMessage = React.DOM.div({className : 'greenText'}, "Ouvert"):
                openMessage = React.DOM.div({className : 'redText'}, "Fermé");
        
        var schedule = React.DOM.div({}, [
                                     React.DOM.h2({}, "Horaires"),
                                     openMessage,
                                     React.DOM.div({}, openDayMessage), 
                                     ]);
        
        //============================================================================================
        
        // CROWD
        var len = props.rcFake.crowd.length;
        var waitingLevelNow = open? levelCalc(props.rcFake.maxSize, crowdMoment(now, props.rcFake.crowd, props.rcFake.schedule).value) : undefined;
        
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
            now : now,
            schedule : props.rcFake.schedule
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
