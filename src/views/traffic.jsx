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
 
var formatDate = function(date) {

    var pad = function(number) {
      	if ( number < 10 ) {
        	return '0' + number;
      	}
      	return number;
    }
	return date.getUTCFullYear() +
		'-' + pad( date.getUTCMonth() + 1 ) +
		'-' + pad( date.getUTCDate() ) +
		' ' + pad( date.getUTCHours() ) +
		':' + pad( date.getUTCMinutes() ) +
		':00.000000';
 };

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
    update: function () {

    	if(NotEmpty(this.props.opening_hours) === false ||
			typeof this.props.max === 0) return;

		var self = this;
		var chart = ReactDOM.findDOMNode(this.refs.chart);
			
		// binding inputs for API
		var start = new Date(this.state.date);
		start.setHours(8,0,0,0);
		var end = new Date(this.state.date);
		end.setHours(20,0,0,0);
		
		var data = {
			id: this.props.pheromonId,
			type: 'wifi',
			start: start,
			end: end
		}

		var traces =[];
        var xSignals = [], ySignals = []; // Signal curve
        var xGreen = [], yGreen = []; // Colored squares
        var xOrange = [], yOrange = []; 
        var xRed = [], yRed = []; 
        var xGrey = [], yGrey = []; 
		var results = [];
		requestMeasurements(data)
		.then(function(measures){

			if(measures.length > 0){

				// for each bin of 15 minutes we compute an averge measure
				var now = new Date();
				var ticks = (20-8)*4;
				for (var i = 0; i<=ticks; ++i) {
					
					var beginTick = new Date(self.state.date);
					beginTick.setHours(8+Math.floor(i/4),i*15%60, 0);
					var endTick = new Date(self.state.date);
					endTick.setHours(8+Math.floor((i+1)/4),(i+1)*15%60, 0);

					var values = measures
					.filter(function(measure){
						var date = new Date(measure.date);
						return beginTick <= date && date < endTick;
					})
					.map(function(measure){
						return measure.value.length;
					});

					var avg = (values.reduce(function(sum, a) {
	                    return sum + a;
	                }, 0) / (values.length || 1)) * 100/self.props.max;


					if(beginTick <= now){
	
						var strDate = formatDate(beginTick);
						xSignals.push(strDate);
			            ySignals.push(avg);

			            // Color 
			            if(avg < 30){
			            	xGreen.push(strDate);
			            	yGreen.push(-10);
			            } else if(30 <= avg && avg < 50){
			            	xOrange.push(strDate);
			            	yOrange.push(-10);
			            }
			            else {
			            	xRed.push(strDate);
			            	yRed.push(-10);
			            }
			        }

				}
			}

			traces = [{
	        	type: 'scatter',
	            name: 'trajectoires',
	            showlegend: false,
	            x: xSignals,
	            y: ySignals,
	            marker: {
	            symbol: "x",
	                color: Colors.pink400
	            },
	            line: {shape: 'spline'},
	            mode: 'lines'
	        },
	        {
	        	type: 'scatter',
	            name: 'green',
	            showlegend: false,
	            x: xGreen,
	            y: yGreen,
	            marker: {
	            	symbol: "square",
	                color: Colors.green400
	            },
	            mode: 'markers'
	        },
	        {
	        	type: 'scatter',
	            name: 'orange',
	            showlegend: false,
	            x: xOrange,
	            y: yOrange,
	            marker: {
	            	symbol: "square",
	                color: Colors.amber300
	            },
	            mode: 'markers'
	        },
	        {
	        	type: 'scatter',
	            name: 'red',
	            showlegend: false,
	            x: xRed,
	            y: yRed,
	            marker: {
	            	symbol: "square",
	                color: Colors.red500
	            },
	            mode: 'markers'
	        },
	        {
	        	type: 'scatter',
	            name: 'grey',
	            showlegend: false,
	            x: xGrey,
	            y: yGrey,
	            marker: {
	            	symbol: "square",
	                color: Colors.blueGrey100
	            },
	            mode: 'markers'
	        }
	        ]
	        Plotly.newPlot( chart, traces, 
	        {
	            xaxis:{
	                type: 'date',
	                tickformat:'%H:%M',
	                range: [start.valueOf(), end.valueOf()],
	            },
	            yaxis:{
	                range: [-20,80],
	                showticklabels: false
	            },
	            margin: { t: 0, b: 20, l: 20, r: 20} 
	        }, {showLink: false, displayModeBar: false} );

		})
		.catch(function(error){
			console.error(error);
		})

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
				<div ref="chart" style={{'textAlign': 'center','width':'100%','height':'150px'}}></div>
			</div>
		);
	}
});
