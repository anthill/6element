"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');
var Preview  =  require('./preview');
var MapCore  =  require('./mapCore');
var getColor = require('../js/getColor');

var L; // variable where to store the leaflet global. Will be passed to props... maybe

module.exports = React.createClass({
	getInitialState: function() {
		if(!L && this.props.leaflet)
				L = this.props.leaflet;
			
		return {map: null, markers: [], selected: null, markersLayer: undefined};
	},
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function() {
		return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
	},
	getMapInfos: function(map){
		// Initialization of map
		// Activate map events
		var withBoundingBox = false;
		if(this.props.parameters.boundingBox !== undefined){
			map.off('dragend', this.onMoveMap);
			map.off('zoomend', this.onMoveMap);
			withBoundingBox = true;
			var box = this.props.parameters.boundingBox;
			var southWest = L.latLng(box.minLat, box.minLon);
			var northEast = L.latLng(box.maxLat, box.maxLon);
			map.fitBounds(L.latLngBounds(southWest, northEast));
		}
		map.on('dragend', this.onMoveMap);
		map.on('zoomend', this.onMoveMap);
		this.loadSelection(map, 1, this.props.result.objects, this.props.filters, withBoundingBox ? undefined:this.props.parameters.geoloc, null, false);
	},
	onClickPreview: function(object){
		var self = this;
		if(this.state.selected === null) return;
		if(object === undefined) this.setState({selected: null});
		else this.props.onShowDetail(object);
	},
	onClickMarker: function(e){// -> select a point
		var index = this.state.markersLayer.getLayers().findIndex(function(marker){
			return (marker._leaflet_id === e.target._leaflet_id);
		});
		// On click marker we dimiss left panel if diplayed
		if(index !== -1 && this.props.hideListIfDisplayed !== null) this.props.hideListIfDisplayed();
		this.setState({selected: (index === -1) ? null : this.state.markersLayer.getLayers()[index].idPoint});      
	},
	onClickMap: function(){// -> unselect a point
		if(this.state.selected !== null){
			this.setState({selected: null});
		}
	},
	onMoveMap: function(e){
		
		if(this.state.map !== null && 
			e.hard === undefined){ // Move is fired by User, not FitBounds

			console.log('move fired');
			
			var bounds = this.state.map.getBounds(); 
			var box = {
				'maxLat': bounds.getNorth(),
				'minLat': bounds.getSouth(),
				'maxLon': bounds.getEast(),
				'minLon': bounds.getWest()
			}
			this.props.onSearch(this.props.parameters, box, 3, 0);
		}
	},
	componentWillReceiveProps: function(nextProps){

		if(!L && nextProps.leaflet)
			L = nextProps.leaflet;

		// To improve
		if(this.props === nextProps)
			return;

		// First results, from Geoloc to Bounding box
		var fitBounds = (this.props.status === 1 && nextProps.status === 2);
		if( this.state.map !== null &&
				nextProps.status !== 1){
			//console.log("-> WillReceive");
			this.loadSelection( this.state.map, 
				nextProps.status, 
				nextProps.result.objects, 
				nextProps.filters, 
				nextProps.parameters.geoloc, 
				this.state.selected,
				fitBounds);
		}
	},
	loadSelection: function(map, status, points, filters, center, selected, fitBounds ){
		var self = this;
		// STATUS Definition
		// -1- Empty map, Zoom 13, no BoundingBox, geoloc centered
		// -2- Filled map, no Zoom, BoudingBox, no centered
		// -3- Filled map, no Zoom, no BoundingBox, no centered
		// Cleaning map
		var markersLayer = this.state.markersLayer;
		// markers.forEach(function(marker){
		//   map.removeLayer(marker);
		// });
		if(this.state.markersLayer)
			map.removeLayer(this.state.markersLayer);

		var markers = [];
		var selected = null;
		// -> STATUS 1
		if(status === 1){
			if(center !== undefined){
				map.setView([center.lat, center.lon], Math.min(13, map.getZoom()));
			}
			this.setState({map: map, markersLayer: null, selected: selected});
			return;
		}
		
		// Bouding box to compute (only for STATUS 2)
		var box = { 'n': null, 's': null, 'e': null, 'o': null };
		var markerSelected = null;
		var list = filters
		.filter(function(filter){
				return filter.checked;
		})
		.map(function(filter){
			return filter.name;
		});
		points.filter(function(point){
			return (list.indexOf(point.file) !== -1);
		})
		.forEach(function(point){
			// Confirm that the selected point is still on the map
			if(self.state.selected !== null &&
				self.state.selected === point.properties.id){
				selected = self.state.selected;
			}
			var lat = point.geometry.coordinates.lat;
			var lon = point.geometry.coordinates.lon;
			// Fit extrem points to the bounds
			if(status === 2){
				if(box.n === null || box.n < lat) box.n = lat;
				if(box.s === null || box.s > lat) box.s = lat;
				if(box.e === null || box.e < lon) box.e = lon;
				if(box.o === null || box.o > lon) box.o = lon;
			}
			var isCenter = (point.properties.type === 'centre');
			var hasSensor = (point.properties.pheromon_id !== null);
			var options = {
				color: 'black',
				fill: true,
				fillColor: point.color, 
				fillOpacity: isCenter?1:0.7,
				radius: isCenter?10:7,
				clickable: true,
				weight: isCenter?5:3
			};
			
			// Regular point or Sensor kitted point
			var marker = null;
			if(hasSensor && point.measurements !== undefined){
				var color = getColor(point.measurements.latest, 0, point.measurements.max);

				var pulsingIcon = new L.Icon.Pulse({iconSize:[20,20],fillColor: point.color,pulseColor: color});
				marker = L.marker(new L.LatLng(lat, lon),{icon: pulsingIcon});
			}
			else
			{
				marker =  new L.CircleMarker(new L.LatLng(lat, lon), options);
			} 

			marker["idPoint"] = point.properties.id;
			marker.on("click", self.onClickMarker);
			markers.push(marker);
		});
	
		if(fitBounds){
				
				var southWest = L.latLng(box.s, box.o);
				var northEast = L.latLng(box.n, box.e);
				map.off('dragend', this.onMoveMap);
				map.off('zoomend', this.onMoveMap);
				//console.log('-> map.fitBounds', status);
				map.fitBounds(L.latLngBounds(southWest, northEast));
				map.on('dragend', this.onMoveMap);
				map.on('zoomend', this.onMoveMap);
		}

		if(center !== undefined){
			var CentroidIcon = L.Icon.Default.extend({
				options: {
					iconUrl:     '/img/centroid.png',
					iconSize:     [25, 25],
					shadowSize:   [0, 0], // size of the shadow
					iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
					shadowAnchor: [10, 10], // the same for the shadow
					popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
				}
			});
		}
		var centroid = new L.Marker(new L.LatLng(center.lat, center.lon), {icon: new CentroidIcon()});
		markers.push(centroid);
		centroid.addTo(map);


		map.on('click',   this.onClickMap); 
		
		var markersLayer = L.layerGroup(markers);
		map.addLayer(markersLayer);
		this.setState({map: map, markersLayer: markersLayer, selected: selected});
	},
	render: function() {
		var self = this;
		var result = this.props.result;
		var detailMapJSX = "";
		if(this.state.selected !== null && 
			 this.props.showHeaderAndFooter){
			var index = result.objects.findIndex(function(object){
				return object.properties.id === self.state.selected;
			});
			if(index !== -1) {
				detailMapJSX = (
					<div className="fixedFooter">
						<div id="popup" className="text-center">
							<Preview object={result.objects[index]} onShowDetail={this.onClickPreview}/>
						</div>
					</div>);
			}
		}
		var nbResultJSX = "";
		if(this.props.showHeaderAndFooter && this.props.status !== 1){ // INI
			
			var list = this.props.filters
			.filter(function(filter){
					return filter.checked;
			})
			.map(function(filter){
				return filter.name;
			});
			var nbResults = result.objects.filter(function(place){
				return (list.indexOf(place.file) !== -1);
			}).length;
			
			var labelJSX = nbResults === 0 ?
				(<p>Il n&apos;y a <strong>aucun</strong> résultat pour votre recherche</p>)
				:
				(<p>Il y a <strong>{nbResults}</strong> résultat{nbResults>1?'s':''} pour votre recherche</p>);

			nbResultJSX = (
				<div className="fixedHeader">
					<Mui.ListItem 
						primaryText={labelJSX} 
						disabled={true} 
						style={{'height':'30px','padding':'0px'}}/>
				</div>);
		}
		return (
			<div>
				{nbResultJSX}
				<MapCore getMapInfos={this.getMapInfos} result={result}/>
				{detailMapJSX}
			</div>
		);
	}
});