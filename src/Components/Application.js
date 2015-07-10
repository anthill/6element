'use strict';

var React = require('react');
var moment = require('moment');

var BooleanFilter = React.createFactory(require('./BooleanFilter.js'));
var Levels = React.createFactory(require('./Levels.js'));

var formatHour = require('../utils.js').formatHour;
var formatDay = require('../utils.js').formatDay;
var levelCalc = require('../utils.js').levelCalc;
var isItOpen = require('../utils.js').isItOpen;
var infBound = require('../utils.js').infBound;
var displaySchedule = require('../utils.js').displaySchedule;
var numDay = require('../utils.js').numDay;


/*

interface AppProps{
    rcFake: {}
}
interface AppState{
    fav : bool
}

*/

var App = React.createClass({
    displayName: 'App',

    getInitialState: function(){
        return {
            fav: this.props.userFake.favouriteRC
        };
    },
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);
        
        // 
        var now = moment().utc();
        var week = ['lundi', 'mardi', 'mercredi', 'jeudi' , 'vendredi', 'samedi' , 'dimanche'];
        var months = [ "janvier", "février", "mars", "avril", "mai", "juin",
                          "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        var dayNumWeek = numDay(now);
        var dayNumMonth = now.date();
        var dayName = week[dayNumWeek];
        var monthName = months[now.month()];
        var date = dayName + " " + dayNumMonth + " " +  monthName;
        var hour = now.hours();
        var min = now.minutes();
        var hourmin = parseInt((hour.toString() + min.toString()));
        
        
        

        //=========================================================================================
        
        //HEADER
        
        var name = props.rcFake.name;
        
        var fav = state.fav;
        
        var favourite = new BooleanFilter({
            active: fav,
            className : "col-lg-1 fa fa-star fa-3x",
            onChange: function(){
                if(!fav) {
                    self.setState({fav : true});
                }
                else {
                    self.setState({fav : false});
                }
                props.onFavChange(state.fav ? undefined : props.rcFake.name);
            }      
        });
            
        var title = React.DOM.header({className : ""}, 
            favourite,
            React.DOM.h1({className : "col-lg-4"}, name));
        //============================================================================================
        
        //NAV
        
        //TO DO
        
        var sectionTitles = [] ;
        
        var nav = React.DOM.nav({},
            //tous les titres
            React.DOM.ul({},
                sectionTitles));
                         
        
        //=============================================================================================
        
        // SCHEDULE
                
        var open = isItOpen(now, props.rcFake.schedule);
                
        var openMessage;
        
        var openDayMessage = displaySchedule(week,props.rcFake.schedule);   
        
        var schedule = React.DOM.section({className : "container"},
             React.DOM.div({className : "row"},
                 React.DOM.h2({className : "col-lg-3"}, "Horaires"),
                 open ?  React.DOM.h3({className : 'col-lg-3 greenText'}, "Ouvert"):
                         React.DOM.h3({className : 'col-lg-3 redText'}, "Fermé")),
             openDayMessage);
        
        //============================================================================================
        
        // CROWD
        var len = props.rcFake.crowd.length;
        var waitingLevelNow = open? 
            levelCalc(props.rcFake.maxSize, props.rcFake.crowd[infBound(now)]) : 
            undefined;
        
        var waitingMessages = [["green","<5mn"], ["yellow","5mn<*<15mn"],["orange", ">15mn"], ["black", "fermé"]];
             
        var legendColor = waitingMessages.map(function(level){
            return React.DOM.dl({className : 'inline'},
                React.DOM.dt({className : 'inline colorBlock '+level[0]+ 'Font'}),
                React.DOM.dd({className : 'inline '+level[0]+ 'Text'}, level[1]))
        });
        
        var legendNow = React.DOM.dl({className : 'inline'},
            React.DOM.dt({className : 'inline colorBlock border'}),
            React.DOM.dd({className : 'inline'}, 'maintenant'));
        
        var legend= React.DOM.figcaption({className : 'inline'}, 
            legendColor, 
            legendNow);
                                
        var crowdPrediction = new Levels({
            crowd: props.rcFake.crowd,
            maxSize: props.rcFake.maxSize,
            waitingMessages : waitingMessages,
            now : now,
            schedule : props.rcFake.schedule
        });
        
        var crowd = React.DOM.section({className : "container"}, 
            React.DOM.header({className : "row"},
                React.DOM.h2({className : "col-lg-3"}, "Attente"),
                open ? 
                    React.DOM.h3({className : "col-lg-3 "+
                                  waitingMessages[waitingLevelNow][0]+'Text'},
                        waitingMessages[waitingLevelNow][1]) : 
                    undefined),
            React.DOM.h4({}, date),
            React.DOM.figure({},
                legend,
                React.DOM.div({className : "col-lg-12"}, crowdPrediction))
        );
        
        //============================================================================================
        
        // WASTE
        
        var wastes = {
            // sort bins unavaiable / avaiable
            unavaiable : [],
            avaiable : []        
        }; 
        
        var wasteList;
        
        props.rcFake.wastes.forEach(function(waste){
            if (waste.status === "unavaiable") { 
                wastes.unavaiable.push(waste.type);
            }
            else {
                wastes.avaiable.push(waste.type);   
            }
        });
        
        var lis = [];
        
        var lisAvaiable = [];
        
        var lisUnAvaiable = [] ;
                                           
        Object.keys(wastes).forEach(function(status){
            wastes[status].forEach(function(waste){
                
                var li = React.DOM.dl({},
                    React.DOM.dt({},
                        waste,
                        React.DOM.img({src : props.wastesFile[waste], alt : waste, width : 75})),
                    React.DOM.dd({}, status));
                                      
                if (status === "unavaiable") {
                    var liUnAvaiable = React.DOM.li({className : '"col-lg-6 col-sm-4 col-xs-3 redText'}, li);
                    lisUnAvaiable.push(liUnAvaiable); 
                }
                else {
                    var liAvaiable = React.DOM.li({className : '"col-lg-6 col-sm-4 col-xs-3 greenText'}, li);
                    lisAvaiable.push(liAvaiable);  
                }
                
                lis.push(React.DOM.li({className : "col-lg-6 col-sm-4 col-xs-3"}, li));
            })
        })
        
        var wasteList = React.DOM.section({className : "container"},
            React.DOM.h2({}, "Déchets"),
            React.DOM.ul({}, lisUnAvaiable, lisAvaiable)
            );
        
        var alert = React.DOM.section({className : 'redText'},
            React.DOM.div({className : "fa fa-exclamation-triangle"}, "Benne(s) indisponible(s)"));
            
        //============================================================================================
        
        // LOCALISATION
        
        var localisation = React.DOM.section({className : "container"},
            React.DOM.h2({}, "Localisation"),
            React.DOM.dl({}, 
                React.DOM.dt({}, "adresse : "), 
                React.DOM.dd({}, props.rcFake.address)),
            React.DOM.div({}, 
                React.DOM.dl({},
                    React.DOM.dt({}, "latitude : "),
                    React.DOM.dd({}, props.rcFake.coords.lat)),
                React.DOM.dl({},
                    React.DOM.dt({}, "longitude: "), 
                    React.DOM.dd({}, props.rcFake.coords.long))),
            React.DOM.dl({}, 
                React.DOM.dt({}, "téléphone : "), 
                React.DOM.dd({}, props.rcFake.phone))
        );
        
        //############################################################################################
        
        // ALL
        var header = React.DOM.div({className : "container row"}, 
                      title,
                      alert);
        
        return React.DOM.div({id: 'myApp'},
                            header,
                            schedule,
                            crowd,
                            wasteList,
                            localisation
                            );
    }
});

module.exports = App;
