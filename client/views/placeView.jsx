"use strict";

var React = require('react');

var getColor = require('../js/getColor');
var Calendar = require('./calendar');
var opening_hours = require('opening_hours');
var moment = require('moment');
var momentTZ = require('moment-timezone');

var NotEmpty = function(field){
	if(field === undefined) return false;
	if(field === null) return false;
	if(field === '') return false;
	return true;
}

function fromUTC(str){

    var tmp = str.split('T');
    var vDate = tmp[0].split('-');
    var vTime = tmp[1].split(':');

    var yyyy = parseInt(vDate[0]);
    var MM = parseInt(vDate[1]);
    var dd = parseInt(vDate[2]);
    var hh = parseInt(vTime[0]);
    var mm = parseInt(vTime[1]);
    var ss = parseInt(vTime[2]);

    return new Date(Date.UTC(yyyy,MM-1,dd,hh,mm,ss));
}

module.exports = React.createClass({
	render: function() {

    	var place = this.props.place;
		var id = place.id;
		
	 	// OPENING HOURS
	 	var oh = place.opening_hours === null ? undefined :
            	new opening_hours(place.opening_hours);
        var now = new Date(momentTZ().tz('Europe/Paris').format());
        //console.log(now);
        //var now = fromUTC(momentTZ().tz('Europe/Paris').format());
 
 		var isOpen = oh ? oh.getState(now) : true;
    	var calendarJSX = NotEmpty(place.opening_hours) ?
		(<Calendar opening_hours={place.opening_hours} />) : "";

		// COLOR
		var color = "grey";
		if (place.measures && place.measures.latest && isOpen)
   		   color = getColor(place.measures.latest.latest, 0, place.measures.latest.max);

		// TITLE
		var title = place.name.replace("Déchèterie de ", "");
		title = title.replace("Déchèterie d'", "");

		// DISTANCE
		var distance = place.distance || '';
		if(distance !== '')
			distance = distance < 1000 ? Math.round(distance).toString()+' m - ' : (distance/1000).toFixed(2)+' km -';

		// ADDRESS
		var coordinatesJSX = [];
        if(NotEmpty(place.address_1)){
            coordinatesJSX.push(<span>{place.address_1}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(NotEmpty(place.address_2)){
            coordinatesJSX.push(<span>{place.address_2}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(NotEmpty(place.phone)){
            coordinatesJSX.push(<span><abbr title="phone">T:</abbr> {place.phone}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(coordinatesJSX.length === 0){
            coordinatesJSX.push(<span><em>Pas de coordonnées indiquées</em></span>);
            coordinatesJSX.push(<br/>);
        }
        
        coordinatesJSX.push(<a id={'pos-'+id} href={"http://maps.apple.com/?q="
			+place.lat+","+place.lon}><em>afficher le plan</em></a>);
        coordinatesJSX.push(<br/>);

        coordinatesJSX.push(<br/>);
        coordinatesJSX.push(<span>Particuliers: {place.public_access === 1 ? "oui" : "non"}</span>);
        coordinatesJSX.push(<br/>);
        coordinatesJSX.push(<span>Professionnels: {place.pro_access === 1 ? "oui" : "non"}</span>);
        coordinatesJSX.push(<br/>);
        
        /*coordinatesJSX.push(<br/>);
        coordinatesJSX.push(<span>Gestionnaire: {place.owner}</span>);*/
		
		// BINS
		var binsJSX = "";
		if(NotEmpty(place.bins))
        {
        	binsJSX = place.bins
            .map(function(bin, num){
                return (<li key={'bin'+id+num} className={!isOpen ? 'border-grey' : bin.a ? "border-open":"border-closed"}>{bin.t}</li>);
            });
        }

        // Adapt the height of panels to number of lines to display in charts
        var heightPanel = place.results ? 140 + Object.keys(place.results).length * 20 : 140;
        var stylePanel = {'height': heightPanel.toString()+'px'};

        var disclaimer = place.pheromon_id ? "" :  (<p className="disclaimer"><em>Ce centre n&apos;est équipé de capteur d&apos;affluence</em></p>);
		
		return (
			<div id={id} className="place">
				<ul className="place-header">
					<li><span className="place-avatar" style={{"backgroundColor": color}}></span></li>
					<li><span className="place-title">{title}<br/>
							<span className="place-subtitle">        
								<label className={isOpen?"open":"closed"}>{distance} {isOpen?"Ouvert":"Fermé"}</label>
							</span>
						</span>
					</li>
					<ul style={{"float":"right","listStyleType":"none", "padding": "0"}}>
						<li><button id={'activate-'+id} className="place-infos"><img src='../img/infos.svg'/></button></li>
						<li><button id={'register-'+id} className="place-no-favorite"><img src='../img/no-favorite.svg'/></button></li>
					</ul>
				</ul>
				<div id={'panel-canvas-'+id} className={"panel-active"} style={stylePanel}>
					<div id={'chart-'+id} className="chart"/>
					<div id={'data-'+id} className="data">
						{JSON.stringify(place.results)}
					</div>
				</div> 
				<div id={'panel-infos-'+id} className={"panel-hidden"} style={stylePanel}>
					<div className="coordinates">
						<div className="address">
							{coordinatesJSX}
						</div>
						<div className="opening_hours">
							{calendarJSX}
						</div>
					</div>
				</div>
				<ul className="bins">
					{binsJSX}
				</ul>
				{disclaimer}				
			</div>);
	}
});