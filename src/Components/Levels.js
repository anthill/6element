'use strict';

var React = require('react');
var moment = require('moment');

var Level = React.createFactory(require('./Level.js'));

var numDay = require('../utils.js').numDay;
var levelCalc = require('../utils.js').levelCalc;
var crowdMoment = require('../utils.js').crowdMoment;
var getHoursString = require('../utils.js').getHoursString;
var getMinutesString = require('../utils.js').getMinutesString;
var isItOpen = require('../utils.js').isItOpen;

/*

interface LevelsProps{
    crowd: [{},{} ...] 
    maxSize: integer,
    waitingMessages = [string color, string message][]
    now : Date,
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

        var myDay = props.schedule[numDay(props.now)];
        
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
                props.waitingMessages[levelCalc(props.maxSize, crowdMoment(gap, props.crowd))] :
                props.waitingMessages[3];
            var gapNow = gap === props.now ? gap : false;
            var oClock = (gap.minutes === 0) ? gap : false;

            var li =  Level({
                date: gap.date,
                waiting: waiting,
                gapNow : gapNow,
                oClock : oClock   
            });
            
            lis.push(li);
        }
                                           
        /*var myLevels = props.crowd.map(function(gap){
            var waiting = props.waitingMessages[levelCalc(props.maxSize, gap.value)];
            var oClock = false; 
            var gapDate = new Date(gap.date);
            
            var gapNow = (crowdMoment(props.now, props.crowd, props.schedule)) ? 
                          (crowdMoment(props.now, props.crowd, props.schedule)).date === gap.date :
                          false;
            
            if (gapDate.getMinutes()===0)
                oClock = gapDate.getHours();
            
            return new Level({
                date: gap.date,
                waiting: waiting,
                gapNow : gapNow,
                oClock : oClock
            }); 
        });   */
        
        return React.DOM.div({className: 'inline'},
            lis
        );
    }
});

module.exports = Levels;
