'use strict';

var React = require('react');
var moment = require('moment');

var Level = React.createFactory(require('./Level.js'));

var getDayNumber = require('../utils/utils.js').getDayNumber;
var getCrowdLevel = require('..//utils/utils.js').getCrowdLevel;
var infBound = require('..//utils/utils.js').infBound;
var getHoursString = require('..//utils/utils.js').getHoursString;
var getMinutesString = require('..//utils/utils.js').getMinutesString;
var isItOpen = require('..//utils/utils.js').isItOpen;

/*

interface LevelsProps{
    crowd: [{},{} ...] 
    maxSize: integer,
    waitingMessages = [string color, string message][]
    now : moment,
    schedule : {}
}
interface LevelsState{
}

*/

var Levels = React.createClass({
    displayName: 'Levels',
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
        // console.log('APP props', props);
        // console.log('APP state', state);                   

        var myDay = props.schedule[getDayNumber(props.now)];
        
        var startDay = moment.utc({
            hour : getHoursString(myDay[0].start), 
            minute : getMinutesString(myDay[0].start)});
        
        var endDay = moment.utc({
            hour : getHoursString(myDay[myDay.length-1].end), 
            minute : getMinutesString(myDay[myDay.length-1].end)});
        
        var lis = [];
        
        for(var gap = startDay; gap <= endDay; gap.minutes(gap.minutes()+15)){

            var gapString = gap.toISOString();
            var waiting = isItOpen(gap, props.schedule) ?
                props.waitingMessages[getCrowdLevel(props.maxSize, props.crowd[infBound(gap)])] :
                props.waitingMessages[3];
            var infB = moment(infBound(props.now));
            var gapNow = gap.unix() === infB.unix() ? gap : false;
            var oClock = (gap.minutes() === 0) ? gap.hours() + moment().utcOffset()/60 : false;

            var li =  Level({
                date: gap.date,
                waiting: waiting,
                gapNow : gapNow,
                oClock : oClock   
            });
            
            lis.push(li);
        }

        return React.DOM.div({className: 'parent'},
            lis
        );
    }
});

module.exports = Levels;
