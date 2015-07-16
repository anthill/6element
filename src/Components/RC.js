'use strict';

//Npm modules
var React = require('react');
var moment = require('moment');

//Components
var BooleanFilter = React.createFactory(require('./BooleanFilter.js'));
var Levels = React.createFactory(require('./Levels.js'));

//Functions
var formatHour = require('../utils/formatHour.js');
var formatDay = require('../utils/formatDay.js');
var getCrowdLevel = require('../utils/getCrowdLevel.js');
var isItOpen = require('../utils/isItOpen.js');
var infBound = require('../utils/infBound.js');
var displaySchedule = require('../utils/displaySchedule.js');
var getDayNumber = require('../utils/utils.js').getDayNumber;

//Var

var weekDays = require('../dateLists').weekDays;
var months = require('../dateLists').months;
var pictoDictionary = require('../pictoDictionary.json');


/*

interface RCProps{
    rc: {}
}
interface RCState{
}

*/
var waitingMessages = [["green","<5mn"], ["yellow","5mn<*<15mn"],["orange", ">15mn"], ["gray", "indsponible"]];

var RC = React.createClass({
    displayName: 'RC',
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('RC props', props);
        // console.log('RC state', state);
        
                
        //ACTUAL
        var now = moment().utc();
        var dayNumWeek = getDayNumber(now);
        var dayNumMonth = now.date();
        var dayName = weekDays[dayNumWeek];
        var monthName = months[now.month()];
        var date = dayName + " " + dayNumMonth + " " +  monthName;
            

        //=========================================================================================
        
        //HEADER
        
        var name = props.rc.name;
        
        var favourite = undefined;
        
/*        var fav = props.isFav;
        
        var favourite = new BooleanFilter({
            fav: fav,
            className : "col-lg-1 fa fa-star fa-3x",
            onChange: function(favState){
                props.onFavChange(props.rc.id, favState);
            }      
        });*/
            
        var title = React.DOM.header({className : ""}, 
            favourite,
            React.DOM.h1({className : "col-lg-4"}, name));
        //============================================================================================
        
        //NAV
        
        //TO DO
        
        var sectionTitles = [] ;
        
        var nav = React.DOM.nav({},
            //each section header
            React.DOM.ul({},
                sectionTitles));
                         
        
        //=============================================================================================
        
        // SCHEDULE
                
        var open = isItOpen(now, props.rc.schedule);
        
        var openDayMessage = displaySchedule(weekDays,props.rc.schedule);   
        
        var schedule = React.DOM.section({className : "container"},
             React.DOM.div({className : "row"},
                 React.DOM.h2({className : "col-lg-3"}, "Horaires"),
                 open ?  React.DOM.h3({className : 'col-lg-3 greenText'}, "Ouvert"):
                         React.DOM.h3({className : 'col-lg-3 redText'}, "Fermé")),
             openDayMessage);
        
        //============================================================================================
        
        // CROWD
        
        //check is today is closed or last gap hour end is passed
        //then display the next open day bound
        
        //if open or in a break
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
        
        var waitingLevelNow = open? 
            getCrowdLevel(props.rc.maxSize, props.rc.crowd[infBound(now)]) : 
            undefined;
                                
        var crowdPrediction = new Levels({
            crowd: props.rc.crowd,
            maxSize: props.rc.maxSize,
            waitingMessages : waitingMessages,
            now : now,
            schedule : props.rc.schedule
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
            // sort bins unavailable / available
            unavailable : [],
            available : []        
        }; 
        
        var wasteList;
        
        props.rc.wastes.forEach(function(waste){
            if (waste.status === "unavailable") { 
                wastes.unavailable.push(waste.type);
            }
            else {
                wastes.available.push(waste.type);   
            }
        });
        
        var lis = [];
        
        var lisAvailable = [];
        
        var lisUnAvailable = [] ;
                                           
        Object.keys(wastes).forEach(function(status){
            wastes[status].forEach(function(waste){
                                
                var li = React.DOM.dl({},
                    React.DOM.dt({},
                        waste),
                        React.DOM.img({src : pictoDictionary[waste], alt : waste, width : 75}),
                    React.DOM.dd({}, status));
                                      
                if (status === "unavailable") {
                    var liUnavailable = React.DOM.li({className : '"col-lg-6 col-sm-4 col-xs-3 redText'}, li);
                    lisUnAvailable.push(liUnavailable); 
                }
                else {
                    var liavailable = React.DOM.li({className : '"col-lg-6 col-sm-4 col-xs-3 greenText'}, li);
                    lisAvailable.push(liavailable);  
                }
                
                lis.push(React.DOM.li({className : "col-lg-6 col-sm-4 col-xs-3"}, li));
            })
        })
        
        var wasteList = React.DOM.section({className : "container"},
            React.DOM.h2({}, "Déchets"),
            React.DOM.ul({}, lisUnAvailable, lisAvailable)
            );
        
        var alert = React.DOM.div({className : 'redText'},
            React.DOM.div({className : "fa fa-exclamation-triangle"}, "Benne(s) indisponible(s)"));
            
        //============================================================================================
        
        // LOCALISATION
        
        var localisation = React.DOM.section({className : "container"},
            React.DOM.h2({}, "Localisation"),
            React.DOM.dl({}, 
                React.DOM.dt({}, "adresse : "), 
                React.DOM.dd({}, props.rc.address)),
            React.DOM.div({}, 
                React.DOM.dl({},
                    React.DOM.dt({}, "latitude : "),
                    React.DOM.dd({}, props.rc.coords.lat)),
                React.DOM.dl({},
                    React.DOM.dt({}, "longitude: "), 
                    React.DOM.dd({}, props.rc.coords.long))),
            React.DOM.dl({}, 
                React.DOM.dt({}, "téléphone : "), 
                React.DOM.dd({}, props.rc.phone))
        );
        
        //############################################################################################
        
        // ALL
        var header = React.DOM.div({className : "container row"}, 
                      title,
                      alert);
        
        return React.DOM.div({id: 'myRC'},
                            header,
                            schedule,
                            crowd,
                            wasteList,
                            localisation
                            );
    }
});

module.exports = RC;
