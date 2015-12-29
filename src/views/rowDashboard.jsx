"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');

var getRawPlace = require('../js/prepareServerAPI')(require('../js/sendReq')).getRawPlace;

var Calendar  =  require('./calendar.js');

var computeCharts = require('../js/computeCharts');

var NotEmpty = function(field){
	if(typeof field === 'undefined') return false;
	if(field === null) return false;
	if(field === '') return false;
	return true;
}

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

module.exports = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function() {
		return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
	},
	getInitialState: function() {
		var date = new Date(this.props.date);
		return { place: undefined, date: date, results: undefined };
	},
	componentDidMount: function() {
		
		var self = this;
		getRawPlace(this.props.placeId)
		.then(function(place){ 
			self.computeChart(place, self.state.date);
		})
		.catch(function(error){
			console.error('get place on '+self.props.placeId.toString(), error);
		})
    },
    componentWillReceiveProps: function(nextProps){
		
		if( this.state.date !== nextProps.date){
        	var date = new Date(nextProps.date);
			this.computeChart(this.state.place, date);
		}
	},
    componentDidUpdate: function(){
        
    	if(this.state.results === undefined) return;
        this.drawChart();
    },
    computeChart: function(place, date){

    	if(place === undefined) return;

    	var self = this;
    	
    	// binding inputs for API
		var start = new Date(date);
		start.setHours(8,0,0,0);
		var end = new Date(date);
		end.setHours(20,0,0,0);

		computeCharts(place, start, end)
        .then(function(results){
        	self.setState({place: place, date: date, results: results});
    	})
        .catch(function(error){
        	console.error(error);
        })
    },
    drawChart: function () {

		if(this.state.results === undefined) return;

		var results = this.state.results;
        var start = new Date(this.state.date);
		start.setHours(8,0,0,0);
		var end = new Date(this.state.date);
		end.setHours(20,0,0,0);

		var chart = ReactDOM.findDOMNode(this.refs.chart);
        
    	// Legend on left
    	var tickvals = [-10];
    	var ticktext = ['Affluence'];
    	var nbCaractMax = 9; // 'A' 'f' 'f' 'l' 'u' 'e' 'n' 'c' 'e'
    	results.ticksY.forEach(function(tickY, index){
    		tickvals.push(-20*index-50);
    		ticktext.push(tickY);
    		if(tickY.length > nbCaractMax)
    			nbCaractMax = tickY.length;
    	});
    	var minTick = results.ticksY.length*-20 - 50;

    	Plotly.newPlot( chart, results.traces, 
        {
            xaxis:{
                type: 'date',
                tickformat:'%H:%M',
                range: [start.valueOf(), end.valueOf()],
            },
            yaxis:{
                range: [minTick,100],
                tickvals: tickvals,
                ticktext: ticktext,
                showline: false
            },
            margin: { t: 0, b: 20, l: nbCaractMax*8, r: 20} 
        }, {showLink: false, displayModeBar: false} );
    },
    render: function() {

    	if(this.state.place === undefined) return (<div></div>);

		var place = this.state.place;

		 // Address
        var coordinatesJSX = [];
        if(NotEmpty(place.properties.address_1)){
            coordinatesJSX.push(<span>{place.properties.address_1}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(NotEmpty(place.properties.address_2)){
            coordinatesJSX.push(<span>{place.properties.address_2}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(NotEmpty(place.properties.phone)){
            coordinatesJSX.push(<span><abbr title="phone">T:</abbr> {place.properties.phone}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(coordinatesJSX.length === 0){
            coordinatesJSX.push(<span><em>Pas de coordonnées indiquées</em></span>);
            coordinatesJSX.push(<br/>);
        }

        var calendarJSX = NotEmpty(place.properties.opening_hours) ?
        		(<Calendar opening_hours={place.properties.opening_hours} />) : "";
               	
       	var chartJSX = (<p><em>Ce centre n&apos;est pas équipé de capteur d&apos;affluence</em></p>);
       	if(place.properties.pheromon_id !== undefined && 
            place.properties.pheromon_id !== null){

       		var height = 150;
       		if(this.state.results !== undefined){
       			height += this.state.results.ticksY.length * 20;
       		}
       		chartJSX = (<div ref="chart" style={{'textAlign': 'center','width':'100%','height':height.toString()+'px'}}></div>);
       	} 
       	
       	var color = 'grey';
       	if(this.state.results !== undefined){
       		var ySignals = this.state.results.traces[0].y; 
       		var value = ySignals[ySignals.length-1]/100; // Signals
       		if(value >= 0 && value <= 0.3) color = 'green';
			else if(value > 0.3 && value <= 0.5) color = 'orange';
			else if(value > 0.5) color = 'red';
       	}	
       	
		return (
			<Mui.Card style={{'marginTop': '10px'}}>
	            <Mui.CardHeader 
                    title={place.properties.name} 
                    subtitle={place.properties.owner}
                    avatar={<Mui.Avatar style={{backgroundColor: color}}></Mui.Avatar>}
                    style={{textAlign: "left", overflow: "hidden"}}
                    actAsExpander={true} 
                    showExpandableButton={true}/>
    			<Mui.CardText expandable={true}>
    			    <table style={{width:"100%", backgroundColor: Colors.blueGrey100}}>
	                    <tbody>
	                        <tr>
	                            <td id="address"style={{width:"50%", padding:"10px", verticalAlign: "top"}}>
	                                <Mui.CardTitle title="Adresse" subtitle={coordinatesJSX}/>
	                            </td>
	                            <td id="accessTime" style={{width:"50%", padding:"10px", verticalAlign: "top"}}>
	                                <Mui.CardTitle title="Horaires" subtitle={calendarJSX}/>
	                            </td>
	                        </tr>
	                    </tbody>
	                </table>
    			</Mui.CardText>
    			<Mui.CardText>
    				{chartJSX}
	            </Mui.CardText>
	        </Mui.Card>
		);
	}
});