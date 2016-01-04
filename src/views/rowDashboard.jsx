"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');
var Calendar  =  require('./calendar.js');

var computeCharts = require('../js/computeCharts');
var getColor = require('../js/getColor');

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

// for dev: http://192.168.99.100:3500/
//var io6element = require('socket.io-client')('http://6element.fr');
//io6element.connect();

module.exports = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function() {
		return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
	},
	getInitialState: function() {

        // On 'bin' socket received from Pheromon by the server and transferred, 
        // we will update the concerned bin status
        /*if(this.props.mode === 'citizen')
            io6element.on('bin', this.updateBin);*/

		return { place: this.props.place, date: this.props.date, results: undefined, bins: this.props.place.properties.bins };
	},
    updateBin: function(data){

        var place = this.props.place;
        if( place.properties.pheromon_id === null ||
            place.properties.pheromon_id !== data.installed_at)
            return;

        var bins = this.state.bins;
        var index = bins.findIndex(function(elt){
            return elt.id === data.bin.id;
        })

        if(index === -1) console.log('Bin with id=' + data.bin.id + ' unfound');
        else {
            bins[index] = data.bin;
            this.setState({bins: bins});
        }
    },
	componentDidMount: function() {
        //console.log("didMount", this.state.place);
		this.computeChart(this.state.place, this.state.date, this.props.mode);
    },
    componentWillReceiveProps: function(nextProps){
		//console.log('willReceive', this.state.date, nextProps.date);
        if( this.state.date !== nextProps.date){
            var date = new Date(nextProps.date);
			this.computeChart(this.state.place, date, this.props.mode);
		}
	},
    componentDidUpdate: function(){
        
    	if(this.state.results === undefined) return;
        this.drawChart();
    },
    computeChart: function(place, date, mode){

    	if(place === undefined) return;

    	var self = this;
    	
    	// binding inputs for API
		var start = new Date(date);
		start.setHours(8,0,0,0);
		var end = new Date(date);
		end.setHours(20,0,0,0);

		computeCharts(place, start, end, mode)
        .then(function(results){
            self.setState({place: place, date: date, results: results});
    	})
        .catch(function(error){
        	console.error(error);
        })
    },
    drawChart: function () {

		if(this.state.results === undefined) return;

        var self = this;
		var results = this.state.results;
        var start = new Date(this.state.date);
		start.setHours(8,0,0,0);
		var end = new Date(this.state.date);
		end.setHours(20,0,0,0);

		var chart = ReactDOM.findDOMNode(this.refs['chart'+this.state.place.properties.id.toString()]);
        
    	// Legend on left
    	var tickvals = [-10];
    	var ticktext = ['Affluence'];
    	var nbCaractMax = 9; // 'A' 'f' 'f' 'l' 'u' 'e' 'n' 'c' 'e'
    	results.ticksY.forEach(function(tickY, index){

            if(self.props.width < 350 && tickY.length > 10)
    		  tickY = tickY.substr(0,9)+'.';

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
        //console.log('draw final', this.state.place.properties.id);
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
       		chartJSX = (<div ref={'chart'+this.state.place.properties.id.toString()} style={{'textAlign': 'center','width':'100%','height':height.toString()+'px'}}></div>);
       	} 
       	
        var color = "grey";
        if (this.state.place.measurements)
   		   var color = getColor(this.state.place.measurements.latest, 0, this.state.place.measurements.max);
       	
        // Undisplay avatar under 350px
        var avatarJSX = this.props.width < 350 ? undefined :
            (<Mui.Avatar style={{backgroundColor: color}}></Mui.Avatar>);

        // Bins if mode citizen activated
        var binsJSX = "";
        if(this.props.mode === 'citizen' &&
            this.state.bins !== undefined)
        {
            binsJSX = this.state.bins
            .map(function(bin, id){
                return (<li key={'allow'+place.properties.id.toString()+id.toString()} className={bin.a?"border-open":"border-closed"}>{bin.t}</li>);
            });
        }


		return (
			<Mui.Card style={{'marginTop': '10px'}} key={place.properties.id}>
	            <Mui.CardHeader 
                    title={place.properties.name} 
                    subtitle={place.properties.owner}
                    avatar={avatarJSX}
                    style={{textAlign: "left", overflow: "hidden"}}
                    actAsExpander={true} 
                    showExpandableButton={true}/>
    			<Mui.CardText expandable={true}>
    			    <table style={{width:"100%", backgroundColor: Colors.blueGrey50}}>
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
                    <div className="allowedObjects">
                        <ul>{binsJSX}</ul>
                    </div>
	            </Mui.CardText>
	        </Mui.Card>
		);
	}
});