"use strict";

var React = require('react');
var L = require('leaflet');
var Colors = require('material-ui/lib/styles/colors');

var Preview  =  require('./preview.jsx');
var MapCore     =  require('./mapCore.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {map: null, markers: [], selected: null};
  },
  getMapInfos: function(map){
    this.loadSelection(map, 1, this.props.result.objects, this.props.files, this.props.geoloc, null);
  },
  onClickPreview: function(){
    this.props.onShowDetail(this.props.result.objects[this.state.selected]);
  },
  onClickMarker: function(e){// -> select a point
    var index = this.state.markers.findIndex(function(marker){
      return (marker.id === e.target._leaflet_id);
    });
    this.setState({selected: (index === -1) ? null : index});      
  },
  onClickMap: function(){// -> unselect a point
    if(this.state.selected !== null){
      this.setState({selected: null});
    }
  },
  onMoveMap: function(e){
    if(this.state.map !== null){
      var bounds = this.state.map.getBounds(); 
      var box = {
        'maxLat': bounds.getNorth(),
        'minLat': bounds.getSouth(),
        'maxLon': bounds.getEast(),
        'minLon': bounds.getWest()
      }
      this.props.onSearch(this.props.geoloc, box, 3);
    }
  },
  componentWillReceiveProps: function(nextProps){
    if( this.state.map !== null &&
        nextProps.status !== 1){
      this.loadSelection(this.state.map, nextProps.status, nextProps.result.objects, nextProps.files, nextProps.geoloc, this.state.selected);
    }
  },
  loadSelection: function(map, status, points, files, center, selected ){

    // STATUS Definition
    // -1- Empty map, Zoom 13, no BoundingBox, geoloc centered
    // -2- Filled map, no Zoom, BoudingBox, no centered
    // -3- Filled map, no Zoom, no BoundingBox, no centered

    // Cleaning map
    var markers = this.state.markers;
    markers.forEach(function(marker){
      map.removeLayer(marker);
    });
    markers = [];

    // -> STATUS 1
    if(status === 1){

      map.setView([center.lat, center.lon], Math.min(13, map.getZoom()));
      this.setState({map: map, markers: markers, selected: selected});
      return;
    }

    var self = this;
    
    // Bouding box to compute (only for STATUS 2)
    var box = { 'n': null, 's': null, 'e': null, 'o': null };

    var markerSelected = null;

    var list = [];
    files.forEach(function(file){
      if(file.checked === true) list.push(file.name);
    });
    points.filter(function(point){
      return (list.indexOf(point.file) !== -1);
    })
    .forEach(function(point, index){

        var lat = point.geometry.coordinates.lat;
        var lon = point.geometry.coordinates.lon;

        // Fit extrem points to the bounds
        if(status === 2){
          if(box.n === null || box.n < lat) box.n = lat;
          if(box.s === null || box.s > lat) box.s = lat;
          if(box.e === null || box.e < lon) box.e = lon;
          if(box.o === null || box.o > lon) box.o = lon;
        }

        var isSelected = false;//(selected !== null && selected === index);
        var isCenter = (point.properties.type === 'centre');
        var options = {
          color: 'black',
          fill: true,
          fillColor: point.color, 
          fillOpacity: isCenter?1:0.7,
          radius: isCenter?10:7,
          clickable: true,
          weight: isCenter?5:3
        };
        
        // Special icon for selected point
        if(isSelected){

            var PingIcon = L.Icon.Default.extend({
              options: {
                iconUrl:      '/img/ping.png',
                iconSize:     [30, 30],
                shadowSize:   [0, 0], // size of the shadow
                iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
                shadowAnchor: [10, 10], // the same for the shadow
                popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
              }
            });
            markerSelected = new L.Marker(new L.LatLng(lat, lon), {icon: new PingIcon()});      
        } 
        // Regular point
        else{
            var marker = new L.CircleMarker(new L.LatLng(lat, lon), options);
            marker.on("click", self.onClickMarker);
            marker.addTo(map); 
            markers.push({
              id: marker._leaflet_id,
              marker: marker
            });
        }
    });
    
    // Adding selected piont at the top (if necessary)
    if(markerSelected !== null){
        markerSelected.addTo(map);      
        markers.push({
          id: markerSelected._leaflet_id,
          marker: markerSelected
        });
    }
    else if(status === 2 &&
            points.length > 0){
        var southWest = L.latLng(box.s, box.o);
        var northEast = L.latLng(box.n, box.e);
        map.off('moveend', this.onMoveMap);
        map.fitBounds(L.latLngBounds(southWest, northEast));
        map.on('moveend', this.onMoveMap);
    }

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
    var centroid = new L.Marker(new L.LatLng(center.lat, center.lon), {icon: new CentroidIcon()});
    markers.push(centroid);
    centroid.addTo(map);

    map.on('click',   this.onClickMap); 
    console.log(map === this.state.map);
    console.log(markers.length, "markers");
    
    this.setState({map: map, markers: markers, selected: selected});
  },
  render: function() {

    if(this.props.result.length===0) return "";

    var result = this.props.result;
    var detailMapJSX = "";
    if(this.state.selected !== null){
    
      detailMapJSX = (
        <div id="popup" className="text-center">
          <a href="javascript:;" className="noRef clickable" onClick={this.onClickPreview}>
            <Preview object={result.objects[this.state.selected]} />
          </a>
        </div>);
    }
    var nbResultJSX = "";
    if(result.objects.length){
      nbResultJSX = (<p id="nbResults">Il y a <strong>{result.objects.length}</strong> résultats pour votre recherche</p>);
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