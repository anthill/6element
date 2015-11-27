"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var opening_hours = require('opening_hours');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var Colors = require('material-ui/lib/styles/colors');

var NotEmpty = function(field){
	if(typeof field === 'undefined') return false;
	if(field === null) return false;
	if(field === '') return false;
	return true;
}

module.exports = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function() {
		return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
	},
	onClickPreview: function(object){
		this.props.onShowDetail(object);
	},
	render: function() {

		var object = this.props.object;

		// Distance field
		var distance = (object.distance > 1000) ? 
			(object.distance/1000).toFixed(2) + "Km":
			Math.round(object.distance).toString() + "m";
		 
		var openJSX = "";
		if(NotEmpty(object.properties.opening_hours)){
			var oh = new opening_hours(object.properties.opening_hours);
			var isOpen = oh.getState();
			openJSX = (<span className={isOpen?"open":"closed"}><br/>{isOpen?"Ouvert actuellement":"Fermé actuellement"}</span>);
		}

		return (
			<Mui.ListItem
			    leftAvatar={<Mui.Avatar backgroundColor={object.color}></Mui.Avatar>}
			    rightAvatar={<Mui.Avatar size={20} color={Colors.grey600} backgroundColor={Colors.transparent} style={{'marginRight': '15px'}}>{distance}</Mui.Avatar>}
               	primaryText={object.properties.name}
			    secondaryText={<span>{object.file}{openJSX}</span>}
  				secondaryTextLines={openJSX === "" ? 1:2}
			    onTouchTap={this.onClickPreview.bind(this,object)}/>
		);
	}
});