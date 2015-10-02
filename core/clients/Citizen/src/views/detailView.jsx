"use strict";

var React = require('react');
var Rate  =  require('./rate.jsx');
var Calendar  =  require('./calendar.jsx');
var Traffic  =  require('./traffic.jsx');

var NotEmpty = function(field){
  if(typeof field === 'undefined') return false;
  if(field === null) return false;
  if(field === '') return false;
  return true;
}

module.exports = React.createClass({
  select: function(index){
    this.props.select(index);
  },
  render: function() {

    var self = this;
    var object = this.props.object;

    // Distance field
    var distance = (object.distance > 1) ? 
      object.distance.toFixed(2) + " Km":
      (Math.round(object.distance * 1000)).toString() + " m";
     
    // Categories list
    var allowedJSX = Object.keys(object.properties.objects)
    .filter(function(category){
      return object.properties.objects[category] === 1;
    })
    .map(function(category, id){
      return (<li key={id}>{category}</li>);
    });
    
    // Address
    var coordinatesJSX = [];
    if(NotEmpty(object.properties.address_1)){
      coordinatesJSX.push(<li>{object.properties.address_1}</li>);
    }
    if(NotEmpty(object.properties.address_2)){
      coordinatesJSX.push(<li>{object.properties.address_2}</li>);
    }
    if(NotEmpty(object.properties.phone)){
      coordinatesJSX.push(<li><abbr title="phone">T:</abbr> {object.properties.phone}</li>);
    }
    if(coordinatesJSX.length === 0){
      coordinatesJSX.push(<li><em>Pas de coordonnées indiquées</em></li>);
    }
    
    var calendarJSX = "";
    if(NotEmpty(object.properties.opening_hours)){
      calendarJSX = (<Calendar opening_hours={object.properties.opening_hours} />);
    }

    var detailJSX = [];
    if(self.props.isDetailed){
      detailJSX.push(
        <div className="row clearfix styleRow text-center">
          {calendarJSX}
        </div>);
      /*detailJSX.push(
        <div className="row clearfix styleRow">
          <div className="col-lg-6 text-left">
            <ul className="addressFull">{coordinatesJSX}</ul>
          </div>
          <div className="col-lg-6">
            {calendarJSX}
          </div>
        </div>);
      detailJSX.push(
       <div className="row clearfix styleRow">
        <div className="text-left">
          <label className="text-left">Affluence:</label><br/>
          <Traffic />
        </div>
      </div>);
      detailJSX.push(
       <div className="row clearfix styleRow">
        <div className="text-left">
          <label>Déchets acceptés:</label>
        </div>
        <ul className="allowedObjects">
          {allowedJSX}
        </ul>
      </div>);*/
    }
    
    // Final Object render
    return (
      <div>
        <div className="row clearfix styleRow">
          <div className="pull-left text-left">
            <label><b>{object.properties.name}</b></label><br/>
            <label><small><em>src: {object.file.replace('.json', '')}</em></small></label>
          </div>
          <div className="pull-right text-right">
            <Rate rate={object.rate} /><br/>
            <a href="javascript:;" onClick={self.select.bind(self, self.props.index)}>
              <label className="distance clickable">
                <em>
                  <i className="text-left glyphicon glyphicon-map-marker"></i> {distance} 
                </em>
              </label>
            </a>
          </div>
        </div>
        {detailJSX}
      </div>);
  }
});