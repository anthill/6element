"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var Preview  =  require('./preview.js');

var Colors = require('material-ui/lib/styles/colors');

module.exports = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function() {
		return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
	},
	display: function(trueOrFalse){
		this.setState({displayed: trueOrFalse});
	},
	getInitialState: function() {
		return {displayed: true, maxLength: 20};
	},
	onLoadMore: function(){

		var listFilters = this.props.filters
		.filter(function(filter){
				return filter.checked;
		})
		.map(function(filter){
			return filter.name;
		});

		var nbResults = this.props.result.objects.filter(function(place){
			return (listFilters.indexOf(place.file) !== -1);
		}).length;
		
		var nbPlaces = this.state.maxLength+20;
		this.setState({maxLength: nbPlaces});
		
		if(nbPlaces > nbResults){
		
			var parameters = this.props.parameters;
			parameters.nbPlaces = nbPlaces; 
			this.props.onSearch(this.props.parameters, null, 2, nbPlaces);
	 	}

	},
	render: function() {
			 
		if( this.state.displayed === false ||
			this.props.isStarting())
			return (<div></div>);

		var listFilters = this.props.filters
		.filter(function(filter){
				return filter.checked;
		})
		.map(function(filter){
			return filter.name;
		});
		var results = this.props.result.objects.filter(function(place){
			return (listFilters.indexOf(place.file) !== -1);
		});
		var nbResults = results.length;

	 
		// Panel list
		var self = this;
		var noResultsJSX = ""
		var moreJSX = "";
		if(nbResults === 0){
			noResultsJSX = (<div className="fixedHeader"><p>Il n&apos;y a <strong>aucun</strong> résultat pour votre recherche</p></div>);
		}
		else
		{
			// Results
			var listJSX = [];
			results.slice(0, this.state.maxLength).forEach(function(object){
				listJSX.push( <Preview object={object} onShowDetail={self.props.onShowDetail}/> );
				listJSX.push( <Mui.ListDivider /> );
			});

			// More results
			listJSX.push(
				<Mui.ListItem 
					leftAvatar={<Mui.Avatar backgroundColor={Colors.grey600} color={Colors.white}>+</Mui.Avatar>}
					primaryText="Plus de résultats"
				    onTouchTap={this.onLoadMore} />);
		}
				
		return (
			<Mui.Paper ref="leftNav" id="leftNav" zDepth={1}>
				{noResultsJSX}
				<Mui.List>
					{listJSX}
				</Mui.List>
			</Mui.Paper>);
	}
});