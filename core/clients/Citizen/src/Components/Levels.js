'use strict';

var React = require('react');
var moment = require('moment');

var Level = React.createFactory(require('./Level.js'));

//Functions
var getCrowdLevel = require('../Utils/getCrowdLevel.js');
var isItOpen = require('../Utils/isItOpen.js');
var infBound = require('../Utils/infBound.js');
var getDayNumber = require('../Utils/utils.js').getDayNumber;
var getHoursString = require('../Utils/utils.js').getHoursString;
var getMinutesString = require('../Utils/utils.js').getMinutesString;

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
        var props = this.props;
        
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

            var waiting = isItOpen(gap, props.schedule) ?
                props.waitingMessages[getCrowdLevel(props.maxSize, props.crowd[infBound(gap)])] :
                props.waitingMessages['undefined'];

            var infB = moment(infBound(props.now));
            var gapNow = gap.unix() === infB.unix() ? gap : false;
            var oClock = (gap.minutes() === 0) ? gap.hours() + moment().utcOffset()/60 : false;

            var li = new Level({
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
