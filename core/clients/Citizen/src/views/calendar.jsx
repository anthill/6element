"use strict";

var React = require('react');
var opening_hours = require('opening_hours');

function getMonday(d) {
  d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getHour(date){
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return hours + ':' + minutes;  
}

module.exports = React.createClass({
  render: function() {

    var oh = new opening_hours(this.props.opening_hours);
    var isOpen = oh.getState();
    
    var days = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
    var calendar = days.map(function(day){
      return {
        name: day,
        slots: []
      }
    });
    
    var today = new Date();
    var from = getMonday(today);
    var to   = new Date(from);
    to.setDate(from.getDate()+7);

    oh.getOpenIntervals(from, to).forEach(function(interval){
      if(interval.length >== 2){

        var start = new Date(interval[0]);
        var end = new Date(interval[1]);
        var slot = getHour(start)+'-'+getHour(end);
        var index = start.getDay()===0?6:start.getDay()-1;
        console.log('******');
        console.log(start, end);
        console.log(slot);
        console.log(index);
        calendar[index].slots.push(slot);
      }
    });
    
    calendar = calendar.map(function(day){
      return {
        name: day.name,
        slots: day.slots.length===0?"Fermé":day.slots.join(' '),
        index: -1
      }
    });
    
    var times = [];
    calendar.forEach(function(day){
      var index = times.findIndex(function(slots){
        return day.slots === slots;
      })
      if(index === -1){
        index = times.length;
        times.push(day.slots)
      }
      day.index = index;
    });

    var labelsJSX = [];
    times.map(function(slots, index){

      var days = calendar.filter(function(day){
          return (day.index === index);
      });
      if(slots === 'Fermé'){
        days.forEach(function(day){
          labelsJSX.push(<label>Fermé le {day.name}</label>);
          labelsJSX.push(<br/>);    
        })
      }
      else{
        var name = "Tous les jours";
        if(times.length !== 1){
          name = days.map(function(day){
            return days.length===1?day.name:day.name.substring(0,2);
          })
          .join(' - ');
        } 
        labelsJSX.push(<label>{name}</label>);
        labelsJSX.push(<br/>);
        labelsJSX.push(<label>{slots}</label>);
        labelsJSX.push(<br/>);
      }
    }); 
    
    return (
      <div>
        {labelsJSX}
        <label className={isOpen?"open":"closed"}><b>{isOpen?"Ouvert actuellement":"Fermé actuellement"}</b></label>
      </div>
    );
  }
});