"use strict";

var React = require('react');
var $ = require('jquery');

module.exports = React.createClass({
  componentDidMount: function(){
    this.update();
  },
  componentDidUpdate: function(){
    this.update();
  },
  update: function(){

	var tsChart = React.findDOMNode(this.refs.tsChart);
  	
  },
  render: function() {
    return (
      <div id="traffic" ref="tsChart">
      </div>
    );
  }
});

/*
var TSChart = React.createClass({
  componentDidMount: function(){
    this.update();
  },
  componentDidUpdate: function(){
    this.update();
  },
  update: function () {

    var infos = this.props.infos;

    var tsChart = React.findDOMNode(this.refs.tsChart);

    var labels = [];
    var dataSelect = {};
    var dataUnselect = {};

    this.props.sites.forEach(function(site){
      dataSelect[site] = [];
      dataUnselect[site] = [];
    });
    
    var options = {year: "2-digit", month: "short"};
    var startUTC = infos.date.min;
    var d=1;
    while(startUTC<=infos.date.max)
    {
      var date = new Date(startUTC);

      if(date.getDate() == 1 )
        labels.push([d,date.toLocaleDateString("fr-FR",options)]);
      
      this.props.sites.forEach(function(site){
        dataSelect[site].push(0);
        dataUnselect[site].push(0);
      });
      ++d;
      startUTC += (24*3600*1000);
    }
    var max = d;
  
    // We exclude filters on date & sites => tag = post
    this.props.getActiveData(["post"]).forEach(function(add){
      var beginUTC  = Date.parse(add.dateDebut.substring(0,10));
      if((beginUTC >= infos.date.rangeMin) && 
        ((infos.sites.length==0) || (infos.sites.indexOf(add.site)>-1)))
        dataSelect[add.site][(beginUTC-infos.date.min)/(24*3600*1000)]++;
      else
        dataUnselect[add.site][(beginUTC-infos.date.min)/(24*3600*1000)]++;
    });

    var series = [];
    this.props.sites.forEach(function(site, index){
      series.push({
        data: dataSelect[site].map(function(cpt, d){
          return [d+1,cpt];
        }),
        backgroundColor: blackTransparent,
        color: colors[(3*index+1)%colors.length],
        stack: true,
        bars: { show: true, fill:0.9, lineWidth: 0.2,  barWidth: 1, align: "center" },
        shadowSize: 0,
      });
    });
    this.props.sites.forEach(function(site, index){
      series.push({
        data: dataUnselect[site].map(function(cpt, d){
          return [d+1,cpt];
        }),
        color: grey,
        stack: true,
        bars: { show: true, fill:0.1, lineWidth: 0.2,  barWidth: 1, align: "center" },
        shadowSize: 0,
      });
    });

    var blackTransparent = 'rgba(0,0,0,0.6)';
    var whiteTransparent = 'rgba(255,255,255,0.4)';
    
    var showTooltip = function (x, y, value, dateUTC) {
      var options = {year: "2-digit", month: "short", day: "numeric"};
      var date = new Date(dateUTC);
      var label = date.toLocaleDateString("fr-FR",options)+"<br/>"+value.toString()+" annonces"; 
      $('<div id="tsTip" class="flot-tooltip">' + label + '</div>').css( {
          top: y - 45,
          left: x - 55
      }).appendTo("body").fadeIn(200);
    };
    $.plot($(tsChart), series, 
        {
          xaxis: {  ticks:labels, tickDecimals: 0, tickColor: blackTransparent, min: 1, max: max},
          yaxis: {  ticks: 10, tickColor: blackTransparent},
          grid: { 
              hoverable: true, 
              clickable: true,
              tickColor: blackTransparent,
              borderWidth: 1,
              borderColor: blackTransparent
          },
          legend: {
              labelBoxBorderColor: '#ddd',
              margin: 10,
              position: 'nw',
              noColumns: 1,
              show: false
          }
        }
    );
    var previousXValue = null;
    var previousYValue = null;
    $(tsChart).bind("plothover", function (event, pos, item) {
      if (item) {
          var dateUTC = infos.date.min + (item.datapoint[0]-1)*(24*3600*1000);
          var y = item.datapoint[1].toFixed(0);
          if (previousXValue != item.series.label || y != previousYValue) {
              previousXValue = item.series.label;
              previousYValue = y;
              $("#tsTip").remove();
  
              showTooltip(item.pageX, item.pageY, y, dateUTC);
          }
      }
      else {
          $("#tsTip").remove();
          previousXValue = null;
          previousYValue = null;       
      }
    });
  },
  render: function() {
    // We exclude filters on date & sites => tag = post
    var data = this.props.getActiveData(["post"]);
    return(
      <div>
        <div ref="tsChart" className="height-200" morris={true}>
        </div>
        <div className="height-150 width-full m-t-10 text-center">
          <AttributeChart {... this.props} data={data} attribute="site" heightClass="height-xs" morris={true}/>
        </div>
      </div>                                              
    );
  }
});*/