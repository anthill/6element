"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');
var getPlace = require('../js/prepareServerAPI')(require('../js/sendReq')).getPlace;

var Traffic = require('./traffic.js');
var Calendar  =  require('./calendar.js');

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
		return { place: undefined };
	},
	componentDidMount: function() {
		var self = this;
		getPlace(this.props.placeId)
		.then(function(place){ 
			self.setState({place: place});
		})
		.catch(function(error){
			console.error('get place on '+self.props.placeId.toString(), error);
		})
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
        
       	var max = (place.measurements !== undefined) ? place.measurements.max: 0;
       	
       	var trafficJSX = (place.properties.pheromon_id !== undefined && 
            place.properties.pheromon_id !== null) ?
            (<Traffic opening_hours={place.properties.opening_hours} pheromonId={place.properties.pheromon_id} max={max}/>) 
            :
            (<p id="traffic"><em>Ce centre n&apos;est pas équipé de capteur d&apos;affluence</em></p>);  
 
 		var allowedJSX = place.properties.bins
                        .map(function(bin, id){
                            return (<li key={'allow'+id.toString()} className={bin.a?"border-open":"border-closed"}>{bin.t}</li>);
                        });
		return (
			<Mui.Card style={{'marginTop': '10px'}}>
	            <Mui.CardHeader 
                    title={place.properties.name} 
                    subtitle={place.file}
                    avatar={<Mui.Avatar style={{backgroundColor: place.color}}></Mui.Avatar>}
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
	            	{trafficJSX}
	            </Mui.CardText>
	            <Mui.CardText className="allowedObjects">
	            	<ul>{allowedJSX}</ul>
	            </Mui.CardText>
	        </Mui.Card>
		);
	}
});