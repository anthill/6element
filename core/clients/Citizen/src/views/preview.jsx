"use strict";

var React = require('react');
var Rate  =  require('./rate.jsx');
var opening_hours = require('opening_hours');

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

    var object = this.props.object;

    // Distance field
    var distance = (object.distance > 1) ? 
      object.distance.toFixed(2) + " Km":
      (Math.round(object.distance * 1000)).toString() + " m";
     
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
            <label><small><em>src: {object.file.replace('.json', '')}</em></small></label>
          </div>
          <div className="pull-right text-right">
            <Rate rate={object.rate} /><br/>
            <a href="javascript:;" onClick={this.select.bind(this, this.props.index)}>
              <label className="distance clickable">
                <em>
                  <i className="text-left glyphicon glyphicon-map-marker"></i> {distance} 
                </em>
              </label>
            </a>
          </div>
        </div>
        {openJSX}
      </div>);
  }
});