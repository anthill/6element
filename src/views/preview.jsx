"use strict";

var React = require('react');
var opening_hours = require('opening_hours');
var Mui = require('material-ui');
var Colors = require('material-ui/lib/styles/colors');

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
            <Mui.CardHeader 
              title={object.properties.name} 
              subtitle={object.file}
              avatar={<Mui.Avatar style={{backgroundColor: object.color}}></Mui.Avatar>}
              style={{textAlign: "left", overflow: "hidden", padding: 0}}/>
          </div>
          <div className="pull-right text-right">
            <em><i className="text-left glyphicon glyphicon-map-marker"></i> {distance}</em>
          </div>
        </div>
        {openJSX}
      </div>);
  }
});