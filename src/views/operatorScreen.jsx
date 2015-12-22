"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');

var RowDashboard = require('./rowDashboard.js');
var search = require('../js/prepareServerAPI')(require('../js/sendReq')).search;


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
		var placeIds = [977,996,924,943,956];
		return {
			placeIds: placeIds,
			width: 0
		};
	},
	componentDidMount: function() {
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions);
	},
	componentWillUnmount: function() {
		window.removeEventListener("resize", this.updateDimensions);
	},
	updateDimensions: function() {
	    var width = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
	    if(this.state.width != width){

	      var nbColumns = Math.min(5,Math.floor(width/200));
	      this.setState({width: width, nbColumns: nbColumns});    
	    }
	},
	render: function() {

		var rowsJSX = this.state.placeIds.map(function(placeId){
			return (<RowDashboard key={'place'+placeId.toString()} placeId={placeId} />)
		});

		return (
			<div id="layout">
				<div id="toolbar">
					<Mui.Toolbar>
						<Mui.ToolbarGroup key={0} float="left">
							<Mui.ToolbarTitle text={<a href="/" className="noRef">6element</a>} />
						</Mui.ToolbarGroup>
					</Mui.Toolbar>
				</div>
				<div style={{'maxWidth': '700px', 'margin': '0 auto'}}>
					{rowsJSX}
				</div>
			</div>
		);
	}
});