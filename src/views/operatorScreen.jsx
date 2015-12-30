"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var page = require('page');
var queryString = require('query-string');

var Colors = require('material-ui/lib/styles/colors');

var RowDashboard = require('./rowDashboard.js');
var search = require('../js/prepareServerAPI')(require('../js/sendReq')).search;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var dateToString = function(date){
	return [date.getDate(), date.getMonth()+1, date.getFullYear()].join("-");
} 

var stringToDate = function(dateString){
	var dateParts = dateString.split("-");
	var date = new Date();
	date.setDate(parseInt(dateParts[0]));
	date.setMonth(parseInt(dateParts[1]) - 1);
	date.setYear(parseInt(dateParts[2]));
	return date;
} 

module.exports = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function() {
		return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
	},
	getInitialState: function() {
		// Places in props
		var places = this.props.places;

		// Current date
		if (this.props.date)
			var date = stringToDate(this.props.date);
		else
			var date = new Date();
		date.setHours(0,0,0,0);
		// Citizen or Operator mode
		var operators = [];
		places.forEach(function(place){
			if(operators.indexOf(place.properties.owner) === -1) 
				operators.push(place.properties.owner);
		});

		return {
			places: places,
			date: date,
			width: 0,
			openPanelFilters: false,
			operator: 'Tous',
			mode: operators.length > 1 ? 'citizen' : 'operator'
		};
	},
	componentDidMount: function() {
		this.updateDimensions();
	},
	updateDimensions: function() {
	    var width = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
	    if(this.state.width != width){
	      	this.setState({width: width});    
	    }
	},
	onPrevDate: function(e){
		e.preventDefault();
		var date = this.state.date;
		date.setDate(date.getDate()-1);
		this.updateDate(date);
	},
	onNextDate: function(e){
		e.preventDefault();
		var date = this.state.date;
		date.setDate(date.getDate()+1);
		this.updateDate(date);
	},
	onChangeDate: function(e, date){
		this.updateDate(date);
    },
	updateDate: function(date){
		var qp = {date: dateToString(date)};
		// DIRTY but i guess will change all that after
		var url = window.location.toString().split("?");
		if (url.length > 0)
			var currentOperator = url[0].split("/").pop();
		else
			var currentOperator = url.split("/").pop();
		page("/operator/" + currentOperator + "?" + queryString.stringify(qp));
	},
	onChangePanelFilters: function(open){
		this.setState({openPanelFilters: open});
	},
	onSelectOperator: function(operator, e){
		e.preventDefault();
		this.setState({operator: operator, openPanelFilters:false});
	},
	render: function() {

		// CSS to move in a dedicated JSON file
		var styleHeaderToolbar	= {	'position':'fixed', 'width': '100%', 'top': '0px', 'zIndex': 2 };
		var styleToolbar 		= {'maxWidth': '700px', 'margin': '0 auto'};
		var styleFilter 		= {'listStyleType': 'none', 'margin': '5px', 'display': 'inline-block', 'padding': '5px'};
		var styleFilterToolbar 	= {'maxWidth': '700px', 'margin': '0 auto', 'backgroundColor': 'white', 'marginBottom': '0px', 'borderBottom': 'solid 1px Grey'};
		var styleRow 			= {'maxWidth': '700px', 'margin': '0 auto', 'marginTop': this.state.mode === 'citizen' ? '120px' : '60px'};

		var self = this;
				
		// Rows to display
		var activePlaces = self.state.operator === 'Tous' ? self.state.places :
			 self.state.places.filter(function(place){
				return place.properties.owner === self.state.operator;
			});

		var rowsJSX = activePlaces.map(function(place){
			return (<RowDashboard key={'place'+place.properties.id.toString()} place={place} date={self.state.date} mode={self.state.mode} />);
		});

		// Panel of filters
		var operatorToRegion = {
			"Agglo_Pau": "Pau",
			"USTOM": "Castillonnais-Réolais",
			"SMICVAL": "Libournais",
			"Sinoe": "Bordeaux Métropole"
		}
		var operators = ['Tous'];
		self.state.places.forEach(function(place){
			if(operators.indexOf(place.properties.owner) === -1) operators.push(place.properties.owner);
		});
		var menuItemsJSX = operators.map(function(operator, index){
			var regionLabel = (<span><strong>Tous</strong></span>)
			if (operator !== "Tous")
				regionLabel = (<span><strong>{operatorToRegion[operator]}</strong> <small>({operator})</small></span>);
			return (<Mui.MenuItem index={index} onTouchTap={self.onSelectOperator.bind(self,operator)}>{regionLabel}</Mui.MenuItem>);
		});

		// Toolbar
		var less350px = this.state.width < 350;
		var toolbarGroupsJSX = [];
		// 1) '<' icon 
		if(!less350px) toolbarGroupsJSX.push(
			<Mui.ToolbarGroup key={3} float="right">
                <Mui.IconButton onTouchTap={this.onNextDate} iconClassName="material-icons">keyboard_arrow_right</Mui.IconButton>
            </Mui.ToolbarGroup>);
        // 2)
		toolbarGroupsJSX.push(
			<Mui.ToolbarGroup key={2} float="right">
			    <Mui.DatePicker
			        ref="datePicker"
			        hintText="Calendrier"
			        autoOk={true}
			        wordings={{ok: 'OK', cancel: 'Annuler'}}
			        defaultDate={this.state.date}
			        locale="fr"
			        formatDate={dateToString}
			        textFieldStyle={{'maxWidth': '85px'}}
			        mode="portrait"
			        onChange={this.onChangeDate}/>
			</Mui.ToolbarGroup>);
		// 3) '>' icon 
		if(!less350px) toolbarGroupsJSX.push(
			<Mui.ToolbarGroup key={1} float="right">
                <Mui.IconButton onTouchTap={this.onPrevDate} iconClassName="material-icons">keyboard_arrow_left</Mui.IconButton>
            </Mui.ToolbarGroup>);

        var filterToolbarJSX = this.state.mode === 'operator' ? "" :
    		(<Mui.Toolbar style={styleFilterToolbar}>
				<span>Recherche </span>
				<Mui.FlatButton 
					label="par agglomération" 
					primary={true} 
					style={{'textTransform': 'lowercase'}}
					onTouchTap={this.onChangePanelFilters.bind(this,true)}/>
			</Mui.Toolbar>);

		return (
			<div id="layout">
				<div style={styleHeaderToolbar}>
					<Mui.Toolbar style={styleToolbar} zDepth={2}>
						<Mui.ToolbarGroup key={0} float="left">
							<Mui.ToolbarTitle text={<a href="/" className="noRef">6element</a>} />
						</Mui.ToolbarGroup>
						{toolbarGroupsJSX}
					</Mui.Toolbar>
					{filterToolbarJSX}
				</div>
				<Mui.LeftNav
					docked={false}
					open={this.state.openPanelFilters} 
					onRequestChange={this.onChangePanelFilters}>
					{menuItemsJSX}
				</Mui.LeftNav>
				<div style={styleRow}>
					{rowsJSX}
				</div>
			</div>
		);
	}
});