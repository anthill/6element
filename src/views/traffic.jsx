"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var Colors = require('material-ui/lib/styles/colors');
var requestMeasurements = require('../js/prepareServerAPI')(
		require('../js/sendReq'), 
		'https://pheromon.ants.builders'
).measurements;

var NotEmpty = function(field){
	if(typeof field === 'undefined') return false;
	if(field === null) return false;
	if(field === '') return false;
	return true;
}

module.exports = React.createClass({
	getInitialState: function() {
		
		var date = new Date();
		date.setHours(0,0,0,0)
		return {date: date};
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

		if(NotEmpty(this.props.opening_hours) === false ||
			typeof this.props.max === 0) return;

		var self = this;
		var width = 400;
		var height = 100;
		var tsChart = ReactDOM.findDOMNode(this.refs.tsChart);
		var context = tsChart.getContext('2d');
		context.clearRect(0, 0, width, height);
		
		var start = this.state.date;
		var end = new Date(start);
		end.setDate(start.getDate()+1);
		
		var data = {
			sim: this.props.sensorId,
			type: 'wifi',
			start: start,
			end: end
		}

		var results = [];
		requestMeasurements(data)
		.then(function(measures){
			
			var options = {hour: "2-digit", minute: "2-digit"};
			results = measures.map(function(measure){
				
				var startHour = new Date(measure.date);
				var endHour = new Date(startHour);
				endHour.setMinutes(endHour.getMinutes()+5); 
				return {
					'start': startHour.toLocaleString("fr-FR",options),
					'end':   endHour.toLocaleString("fr-FR",options),
					'level': measure.value.length*100/self.props.max
				}
			});

			self.paint(context, width, height, results);
		})
		.catch(function(error){
			console.error(error);
			self.paint(context, width, height, results);      
		})

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
	paint: function(ctx, width, height, bins){
		
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
