"use strict";

var React = require('react');

var PlaceView = require('./placeView.js');

module.exports = React.createClass({
	render: function() {
		
		var self = this;

		var placesJSX = this.props.places.length === 0 ? (<p className="no-results"><em>Aucune déchèterie enregistrée ne correpond à votre recherche.</em></p>) :
			this.props.places.map(function(place){
				return (<PlaceView key={'place'+place.id} place={place} date={self.props.date} mode={self.props.mode} />);
			});

		/*<button id="btn-map">Afficher la carte</button>
				<div id="map" className="hide-map"/>*/

		return (
			<div id="places">
				{placesJSX}
			</div>)
	}
});