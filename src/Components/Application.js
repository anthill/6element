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
            className : "fa fa-star fa-3x",
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
        
        console.log('props.userF', props.userFake.favouriteRC);
        
        /*return BooleanFilter({
                active: state.filterStates.get(element),
                label: element,
                onChange: function(nextState){
                    if(!nextState)
                        delete state.filterStates[element];
                    else
                        state.filterStates[element] = function(courtier){
                            return courtier[element];
                        };

                    state.filterStates.set(element, nextState);
                    
                    props.onFiltersChange(state.filterStates);

                }    
            })*/
    
        var header = React.DOM.header({className : 'inline'}, 
                            favourite,
                            React.DOM.h1({}, name)
                        );
        //============================================================================================
        
        //NAV
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
        
        var schedule = React.DOM.section({}, [
             React.DOM.h2({}, "Horaires"),
             open ?  React.DOM.h3({className : 'greenText'}, "Ouvert"):
                     React.DOM.h3({className : 'redText'}, "Fermé"),
             React.DOM.dl({}, openDayMessage), 
             ]);
        
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
        
        var crowd = React.DOM.section({}, 
            React.DOM.h2({}, "Attente"),
            open ? React.DOM.h3({className : waitingMessages[waitingLevelNow][0]+'Text'}, waitingMessages[waitingLevelNow][1]) : undefined,
            React.DOM.h4({}, date),
            React.DOM.figure({},
                legend,
                React.DOM.div({}, crowdPrediction))
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
                    var liUnAvaiable = React.DOM.li({className : 'redText'}, li);
                    lisUnAvaiable.push(liUnAvaiable); 
                }
                else {
                    var liAvaiable = React.DOM.li({className : 'greenText'}, li);
                    lisAvaiable.push(liAvaiable);  
                }
                
                lis.push(React.DOM.li({}, li));
            })
        })
        
        var wasteList = React.DOM.section({},
            React.DOM.h2({}, "Déchets"),
            React.DOM.ul({}, lisUnAvaiable, lisAvaiable)
            );
        
        var alert = React.DOM.section({className : 'redText'},
            React.DOM.h2({}, "Alerte"),
            React.DOM.ul({}, lisUnAvaiable)
            );
            
        //============================================================================================
        
        // LOCALISATION
        
        var localisation = React.DOM.section({},
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
