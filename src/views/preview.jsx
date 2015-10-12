"use strict";

var React = require('react');
var opening_hours = require('opening_hours');

var NotEmpty = function(field){
  if(typeof field === 'undefined') return false;
  if(field === null) return false;
  if(field === '') return false;
  return true;
}

module.exports = React.createClass({
  render: function() {

    var object = this.props.object;

    // Distance field
    var distance = (object.distance > 1000) ? 
      (object.distance/1000).toFixed(2) + " Km":
      Math.round(object.distance).toString() + " m";
     
    var openJSX = "";
    if(NotEmpty(object.properties.opening_hours)){
      var oh = new opening_hours(object.properties.opening_hours);
      var isOpen = oh.getState();
      openJSX = (<label className={isOpen?"open":"closed"}><b>{isOpen?"Ouvert actuellement":"Fermé actuellement"}</b></label>);
    }

    // Final Object render
    return (
      <div>
        <div className="row clearfix styleRow">
          <div className="pull-left text-left">
            <label><b>{object.properties.name}</b></label><br/>
            <label><small><em>src: {object.properties.file}</em></small></label>
          </div>
          <div className="pull-right text-right">
            <label>
              <em><i className="text-left glyphicon glyphicon-map-marker"></i> {distance}</em>
            </label>
          </div>
        </div>
        {openJSX}
      </div>);
  }
});