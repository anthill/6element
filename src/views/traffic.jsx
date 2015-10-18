"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var Colors = require('material-ui/lib/styles/colors');

var NotEmpty = function(field){
  if(typeof field === 'undefined') return false;
  if(field === null) return false;
  if(field === '') return false;
  return true;
}

module.exports = React.createClass({
  getInitialState: function() {
    return {date: new Date()};
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
  },
  componentDidMount: function(){
    this.update();
  },
  componentDidUpdate: function(){
    this.update();
  },
  update: function(){

    if(NotEmpty(this.props.opening_hours) === false) return;

    var width = 400;
    var height = 100;
    var tsChart = React.findDOMNode(this.refs.tsChart);
    var context = tsChart.getContext('2d');
    context.clearRect(0, 0, width, height);
    this.paint(context, width, height);
  },
   paint2: function(ctx, width, height){
    
    ctx.globalAlpha=1;
    var margin = 10;
    var rectGrid = { "top": 0, "right": width, "bottom": height, "left": 0 };
    /*var rectGrid = { "top": margin, "right": width-margin, "bottom": height-margin, "left": margin };
    rectGrid["bottom"] -= margin; // Axe X
    */
    var DIMGRAY     = '#696969';
    // *** CLEANING ***
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = DIMGRAY;
    ctx.lineWidth=1;
    ctx.rect(rectGrid.left, rectGrid.top, rectGrid.right-rectGrid.left, rectGrid.bottom-rectGrid.top);
    ctx.stroke();


  },
  paint: function(ctx, width, height){
    
    ctx.globalAlpha=1;
    var margin = 10;
    var rectGrid = { "top": margin, "right": width-margin, "bottom": height-margin, "left": margin };
    rectGrid["bottom"] -= margin; // Axe X
    
    // *** CLEANING ***
    ctx.clearRect(0, 0, width, height);

    // *** COLORS ***
    var WHITE       = '#FFFFFF';
    var BLACK       = '#000000';
    var DIMGRAY     = '#696969';
    var LIGHTGREY   = '#D3D3D3';
    var SALMON      = '#FA8072';
    var RED         = '#FF0000';
    var GREEN       = '#6CC417';
    var GREENY      = '#CCFB5D';
    var YELLOW      = '#FFD801';
    var ORANGE      = '#FBB117';
    var ORANGER     = '#FBB117';

    //var colors = [GREEN, GREEN, GREENY, GREENY, YELLOW, YELLOW, ORANGE, ORANGE, RED, RED, RED];
    var colors = [Colors.grey500, Colors.grey500, Colors.grey400, Colors.grey400, Colors.pink200, Colors.pink200, Colors.pink400, Colors.pink400, Colors.pink500, Colors.pink500, Colors.pink500];

    var minH = 8; // 8h
    var maxH = 20; // 20h
    var nbMinutes = (maxH - minH) * 60;

    // X-AXIS
    var wHour = width / (maxH-minH+1);
    var hLevel = (rectGrid.bottom-rectGrid.top)/100;
    for(var j=0; j<=(maxH-minH); ++j){
        var xUnit = Math.floor(rectGrid.left + j*wHour);
        // Tag
        ctx.beginPath();
        ctx.textAlign = "center"; 
        ctx.textBaseline = "hanging";
        ctx.fillStyle = DIMGRAY;
        ctx.font = "10px 'Arial'";
        ctx.fillText((minH+j).toString(), xUnit,rectGrid.bottom+6);
        ctx.closePath();
   }
    /*
    // Vertical line
        ctx.beginPath();
        ctx.strokeStyle = DIMGRAY;
        ctx.lineWidth=(j%2===0)?0.25:0.125;
        ctx.moveTo(xUnit,rectGrid.bottom);
        ctx.lineTo(xUnit,rectGrid.bottom+4);
        ctx.stroke();
        */

    var getX = function(time){
      var temp = time.split(':');
      return Math.floor(rectGrid.left+(parseInt(temp[0])-minH)*wHour + (parseInt(temp[1])*wHour/60));
    }
    var getY = function(level){
      return Math.floor(rectGrid.bottom-level*hLevel);
    }
    var drawColumn = function(bin){
      var x0 = getX(bin.start);
      var x1 = getX(bin.end);
      var y1 = getY(bin.level);

      for(var k=0; k<bin.level; k=k+10){
        var y0 = getY(Math.min(bin.level,k+10));
        var y1 = getY(k);
        ctx.beginPath();
        ctx.fillStyle = colors[k/10];
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 0.25;
        ctx.rect(x0,y0,x1-x0,y1-y0);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }

    // RANDOM BINS
    var bins = [];
    var step = 15;
    for(var i=9; i<18; ++i){
      for(var j=0; j<60; j=j+step){
        var bin = {
          'start': i.toString()+':'+j.toString(),
          'end': (j+step!==60)?(i.toString()+':'+(j+step).toString()):((i+1).toString()+':00'),
          'level': Math.floor(Math.random()*100)
        }
        bins.push(bin);
      }
    }
    bins.forEach(function(bin){
      drawColumn(bin);      
    });

    ctx.beginPath();
    ctx.strokeStyle = BLACK;
    ctx.lineWidth=0.25;
    ctx.moveTo(rectGrid.left,rectGrid.bottom);
    ctx.lineTo(rectGrid.right,rectGrid.bottom);
    ctx.stroke();
    ctx.closePath();

    /*for(var j=0; j<=maxH-minH; ++j){

        var xPrevious   = rectGrid.left + Math.floor(j     * width / (maxH-minH+1));
        var xUnit       = rectGrid.left + Math.floor((j+1) * width / (maxH-minH+1));
        // Vertical line
        ctx.beginPath();
        ctx.strokeStyle = DIMGRAY;
        ctx.lineWidth=0.25;
        ctx.moveTo(xUnit,rectGrid.top);
        ctx.lineTo(xUnit,rectGrid.bottom+4);
        ctx.stroke();
        // Tag
        ctx.beginPath();
        ctx.textAlign = "center"; 
        ctx.textBaseline = "hanging";
        ctx.fillStyle = DIMGRAY;
        ctx.font = "10px 'Arial'";
        ctx.fillText((minH+j).toString(), xPrevious,rectGrid.bottom+6);
        // # Adds
        ctx.beginPath();
        ctx.textAlign = "center"; 
        ctx.textBaseline = "hanging";
        ctx.fillStyle = DIMGRAY;
        ctx.font = ((this.props.tab==j)?"bold 11px 'Arial'":"10px 'Arial'");
        ctx.fillText(hGroup.adds.length.toString(),Math.floor((xPrevious+xUnit)/2),rectGrid["top"]+6, xUnit-xPrevious);
        // Basis for selection
        if(this.props.tab==j){
            ctx.beginPath();
            ctx.strokeStyle = DIMGRAY;
            ctx.lineWidth=1;
            ctx.rect(xPrevious, rectGrid["top"], xUnit-xPrevious, rectGrid["bottom"]-rectGrid["top"]);
            ctx.stroke();
        }
    } */
  },
  onPrev: function(){
    var date = this.state.date;
    date.setDate(date.getDate()-1);
    this.setState({date: date});
  },
  onNext: function(){
    var date = this.state.date;
    date.setDate(date.getDate()+1);
    this.setState({date: date});
  },
  render: function() {

    if(NotEmpty(this.props.opening_hours) === false) return (<div></div>);

    var options = {weekday: "long", month: "long", day: "numeric"};
    var dayStr = this.state.date.toLocaleDateString("fr-FR",options); 
    return (
      <div id="traffic">
        <Mui.CardActions> 
          <Mui.FlatButton onTouchTap={this.onPrev} label="&#x25C0;" className="flatIcon"/>
          <Mui.FlatButton label={dayStr}/>
          <Mui.FlatButton onTouchTap={this.onNext} label="&#x25BA;" className="flatIcon"/>
        </Mui.CardActions> 
        <canvas ref="tsChart" id="tsChart" width="400" height="100">
        </canvas>
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