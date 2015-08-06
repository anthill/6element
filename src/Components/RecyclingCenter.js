'use strict';

var React = require('react');
var moment = require('moment');

// COMPONENTS
var RCList = React.createFactory(require('../Components/RCList.js'));
var Levels = React.createFactory(require('./Levels.js'));

// STORES
var DisplayedItemStore = require('../Stores/displayedItemStore.js');
var RecyclingCenterStore = require('../Stores/recyclingCenterStore.js');

// ACTIONS
var _toggleRCList = require('../Actions/displayActionCreator.js').toggleRCList;

// UTILS
var weekDays = require('../Utils/utils.js').weekDays;
var getDayNumber = require('../Utils/utils.js').getDayNumber;
var months = require('../Utils/utils').months;
var getCrowdLevel = require('../Utils/getCrowdLevel.js');
var isItOpen = require('../Utils/isItOpen.js');
var infBound = require('../Utils/infBound.js');
var displaySchedule = require('../Utils/displaySchedule.js');
var pictoDictionary = require('../../data/pictoDictionary.json');

var waitingMessages = {
    0: ["green", "<5mn"],
    1: ["yellow", "5mn<*<15mn"],
    2: ["orange", ">15mn"],
    undefined: ["gray", "indisponible"]
};

/*

interface RecyclingCenterProps{
}
interface RecyclingCenterState{
    isListOpen: boolean,
    recyclingCenter: Recycling Center
}

*/

function getStateFromStores() {
    return {
        isListOpen: DisplayedItemStore.isRCListOpen(),
        recyclingCenter: RecyclingCenterStore.getSelected()
    };
}

var RecyclingCenter = React.createClass({
    displayName: 'RecyclingCenter',

    getInitialState: function(){
        return getStateFromStores();
    },

    componentDidMount: function() {
        DisplayedItemStore.on(DisplayedItemStore.events.CHANGE_TAB, this.onChange);
        RecyclingCenterStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DisplayedItemStore.removeListener(DisplayedItemStore.events.CHANGE_TAB, this.onChange);
        RecyclingCenterStore.removeChangeListener(this.onChange);
    },
    
    render: function() {
        var state = this.state;

        var classes = [
            'recyclingCenter'
        ];

        var name = React.DOM.div({
                className: 'name',
                onClick: _toggleRCList
            },
            state.recyclingCenter.name
        );

        var list = state.isListOpen ? new RCList({}) : undefined;


        // SCHEDULE
        var now = moment().utc();
        var dayNumWeek = getDayNumber(now);
        var dayNumMonth = now.date();
        var dayName = weekDays[dayNumWeek];
        var monthName = months[now.month()];
        var date = dayName + " " + dayNumMonth + " " +  monthName;

        var schedule = state.recyclingCenter.schedule;

        var open = isItOpen(now, schedule);
        
        var openDayMessage = displaySchedule(weekDays, schedule);   
        
        var calendar = React.DOM.section({className: "container"},
            React.DOM.div({className: "row"},
                React.DOM.h2({className: "col-lg-3"}, "Horaires"),
                open ?
                    React.DOM.h3({className: 'col-lg-3 open'}, "Ouvert")
                    : React.DOM.h3({className: 'col-lg-3 closed'}, "Fermé")),
            openDayMessage
        );

        // CROWD
        
        //check if today is closed or last gap hour end is passed
        //then display the next open day bound
        
        var legendColor = Object.keys(waitingMessages).map(function(keys){
            var message = waitingMessages[keys];

            return React.DOM.dl({className: 'inline'},
                React.DOM.dt({className: 'inline colorBlock ' + message[0] + 'Font'}),
                React.DOM.dd({className: 'inline ' + message[0] + 'Text'}, message[1]))
        });
        
        var legendNow = React.DOM.dl({className: 'inline'},
            React.DOM.dt({className: 'inline colorBlock border'}),
            React.DOM.dd({className: 'inline'}, 'maintenant'));
        
        var legend = React.DOM.figcaption({className: 'inline'}, 
            legendColor, 
            legendNow
        );
        
        console.log('state.recyclingCenter', state.recyclingCenter)
        
        var waitingLevelNow = open ? 
            getCrowdLevel(state.recyclingCenter.maxSize, state.recyclingCenter.crowd[infBound(now)]): 
            undefined;
                                
        var crowdPrediction = new Levels({
            crowd: state.recyclingCenter.crowd,
            maxSize: state.recyclingCenter.maxSize,
            waitingMessages: waitingMessages,
            now: now,
            schedule: state.recyclingCenter.schedule
        });
        
        console.log("waitingMessages", waitingMessages, waitingLevelNow);
        
        var crowd = React.DOM.section({className: "container"}, 
            React.DOM.header({className: "row"},
                React.DOM.h2({className: "col-lg-3"}, "Attente"),
                open ? 
                    React.DOM.h3({className: "col-lg-3 " + waitingMessages[waitingLevelNow][0] + 'Text'},
                        waitingMessages[waitingLevelNow][1]): 
                    undefined),
            React.DOM.h4({}, date),
            React.DOM.figure({},
                legend,
                React.DOM.div({className: "col-lg-12"}, crowdPrediction))
        );

        // WASTE
        
        var wastes = {
            // sort bins unavailable / available
            unavailable: [],
            available: []        
        }; 
            
        state.recyclingCenter.wastes.forEach(function(waste){
            if (waste.status === "unavailable") { 
                wastes.unavailable.push(waste.type);
            }
            else {
                wastes.available.push(waste.type);   
            }
        });
        
        var lis = [];
        
        var lisAvailable = [];
        
        var lisUnAvailable = [];
                                           
        Object.keys(wastes).forEach(function(status){
            wastes[status].forEach(function(waste){
                                
                var li = React.DOM.dl({},
                    React.DOM.dt({},
                        waste),
                        React.DOM.img({src: pictoDictionary[waste], alt: waste, width: 75}),
                    React.DOM.dd({}, status));
                                      
                if (status === "unavailable") {
                    var liUnavailable = React.DOM.li({className: '"col-lg-6 col-sm-4 col-xs-3 closed'}, li);
                    lisUnAvailable.push(liUnavailable); 
                }
                else {
                    var liavailable = React.DOM.li({className: '"col-lg-6 col-sm-4 col-xs-3 open'}, li);
                    lisAvailable.push(liavailable);  
                }
                
                lis.push(React.DOM.li({className: "col-lg-6 col-sm-4 col-xs-3"}, li));
            })
        })
        
        var wasteList = React.DOM.section({className: "container"},
            React.DOM.h2({}, "Déchets"),
            React.DOM.ul({}, lisUnAvailable, lisAvailable)
            );
        
        var alert = React.DOM.div({className: 'redText'},
            React.DOM.div({className: "fa fa-exclamation-triangle"}, "Benne(s) indisponible(s)"));
        
        // LOCALISATION
        
        var localisation = React.DOM.section({className: "container"},
            React.DOM.h2({}, "Localisation"),
            React.DOM.dl({}, 
                React.DOM.dt({}, "adresse: "), 
                React.DOM.dd({}, state.recyclingCenter.address)),
            React.DOM.div({}, 
                React.DOM.dl({},
                    React.DOM.dt({}, "latitude: "),
                    React.DOM.dd({}, state.recyclingCenter.coords.lat)),
                React.DOM.dl({},
                    React.DOM.dt({}, "longitude: "), 
                    React.DOM.dd({}, state.recyclingCenter.coords.lon))),
            React.DOM.dl({}, 
                React.DOM.dt({}, "téléphone: "), 
                React.DOM.dd({}, state.recyclingCenter.phone))
        );

        
        return React.DOM.div({
                className: classes.join(' ')
            },
            name,
            alert,
            list,
            calendar,
            crowd,
            wasteList,
            localisation
        );
    },

    onChange: function() {
        // Maybe differentiate based on what really needs to be changed
        this.setState(getStateFromStores());
    }
});

module.exports = RecyclingCenter;
