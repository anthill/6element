"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');

module.exports = React.createClass({
	childContextTypes: {
	muiTheme: React.PropTypes.object
},
getChildContext: function() {
	return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
},
getInitialState: function() {
    if(!this.googleMapsApi && this.props.googleMapsApi)
        this.googleMapsApi = this.props.googleMapsApi;
    
	return { parameters: this.props.parameters };
},
componentWillReceiveProps: function(newProps) {
    if(!this.googleMapsApi && newProps.googleMapsApi)
        this.googleMapsApi = newProps.googleMapsApi;
},
initDialog: function(){
	var self = this;
	var parameters = this.state.parameters;
	
	var where = ReactDOM.findDOMNode(this.refs.whereField);
	var val = where.querySelector('input');

	// Goocle API firing
    if(this.googleMapsApi){
        this.googleMapsApi().then(function( maps ) {

            var autocomplete = new maps.places.Autocomplete(val, { types: ['geocode'] });
            maps.event.addListener(autocomplete, 'place_changed', function(){
            var place = autocomplete.getPlace();
            var address = '';
            if (place.address_components) {
                address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
            parameters.geoloc = {lat: place.geometry.location.lat(), lon: place.geometry.location.lng()};
            parameters.placeName = address;
            self.setState({parameters: parameters})
            });
        });
    }
},
// Change in the what bar (fired by the dialog box)
handleSelectWhat: function(e){
	var parameters = this.state.parameters;
	parameters.what = e.target.value;
	this.setState({ parameters: parameters });
},
show: function(){
	this.refs.dialog.show();
},
dismiss: function(){
	this.refs.dialog.dismiss();
},
onDialogSubmit: function(e){
	this.props.submitParameters(this.state.parameters);
},
onDialogCancel: function(e){
	this.props.cancelDialog();
},
render: function() {

	var customActions = [
		<Mui.FlatButton key={2} label="Valider" primary={true} onTouchTap={this.onDialogSubmit} onChange={this.onKeyDown}/>
	];
	
	if(this.props.status!==1) // Not the first screen, we allow cancel action
		customActions.push(<Mui.FlatButton key={1} label="Annuler" primary={true} onTouchTap={this.onDialogCancel} />);

	var whatOptions = this.props.categoriesFR.map(function(category, index){
		return { payload: index, text: category };
	});

	return (
		<Mui.Dialog
			ref="dialog"
			title="6element"
			actions={customActions}
			actionFocus="submit"
			modal={true}
			onShow={this.initDialog}
			openImmediately={this.props.status===1}
			autoDetectWindowHeight={true} 
			autoScrollBodyContent={true}
			contentStyle={{maxWidth: '420px'}}>
			<div>
			<table width="100%">
				<tr>
				<td><Mui.FontIcon className="material-icons" color={Colors.grey600} >description</Mui.FontIcon></td>
				<td>
					<Mui.SelectField
					ref="whatField"
					selectedIndex={this.state.parameters.what}
					onChange={this.handleSelectWhat}
					fullWidth={true}
					menuItems={whatOptions} />
				</td>
				</tr>
				<tr>
				<td><Mui.FontIcon className="material-icons" color={Colors.grey600} >room</Mui.FontIcon></td>
				<td>
					<Mui.TextField
					defaultValue={this.state.parameters.placeName}
					ref="whereField" 
					fullWidth={true}/>
				</td>  
				</tr>
			</table>
			</div>
		</Mui.Dialog>);
	}
});