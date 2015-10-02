"use strict";

var React = require('react');
var L = require('leaflet');
var Colors = require('material-ui/lib/styles/colors');

var Preview  =  require('./preview.jsx');
var MapCore     =  require('./mapCore.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {map: null, markers: [], select: null, selectMap: null, detail: null};
  },
  getMapInfos: function(map){
    this.loadSelection(map, null);
  },
  select: function(index){
    this.loadSelection(this.state.map, index);
  },
  onClickMarker: function(e){
    var index = this.state.markers.findIndex(function(marker){
      return (marker.id === e.target._leaflet_id)
    });
    if(index === -1) 
      this.toggleMap(null);
    else
      this.toggleMap(index);
  },
  onClickMap: function(){
    if(this.state.selectMap !== null){
      this.setState({selectMap: null});
    }
  },
  loadSelection: function(map, select){

    var self = this;
    // Adding icons
    var CentroidIcon = L.Icon.Default.extend({
      options: {
        iconUrl:     '/img/centroid.png',
        iconSize:     [20, 20],
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
        shadowAnchor: [10, 10], // the same for the shadow
        popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
      }
    });
    var PingIcon = L.Icon.Default.extend({
      options: {
        iconUrl:      '/img/ping.png',
        iconSize:     [20, 20],
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
        shadowAnchor: [10, 10], // the same for the shadow
        popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
      }
    });
    var centroidIcon = new CentroidIcon();
    var pingIcon = new PingIcon();
    
    // Cleaning map
    var markers = this.state.markers;
    markers.forEach(function(marker){
      map.removeLayer(marker);
    });
    markers = [];
    
    var markerSelected = null;
    this.props.result.objects
    .forEach(function(object, index){

        var isSelected = (select !== null && 
                        select === index);
        var isCenter = (object.properties.type === 'centre');
        var options = {
          color: isCenter?'black':object.color,
          fill: true,
          fillColor: object.color, 
          fillOpacity: isCenter?1:0.7,
          radius: isCenter?10:5,
          clickable: true,
          weight: '5px'
        };
        
        if(isSelected){
            markerSelected = new L.Marker(new L.LatLng(object.geometry.coordinates.lat, object.geometry.coordinates.lon), {icon: pingIcon});      
            markerSelected.on("click", self.onClickMarker);
            map.setView([object.geometry.coordinates.lat, object.geometry.coordinates.lon], 16);
        } 
        else if (isCenter){
            var marker = new L.CircleMarker(new L.LatLng(object.geometry.coordinates.lat, object.geometry.coordinates.lon), options);
            marker.on("click", self.onClickMarker);
            marker.addTo(map); 
            markers.push({
              id: marker._leaflet_id,
              marker: marker
            });
        }
        else{
            var marker = new L.Circle(new L.LatLng(object.geometry.coordinates.lat, object.geometry.coordinates.lon), 10, options);
            marker.addTo(map);
            marker.on("click", self.onClickMarker);
            markers.push({
              id: marker._leaflet_id,
              marker: marker
            });
        } 
    });
    var geoloc = this.props.result.geoloc;
    if(markerSelected !== null){
        markerSelected.addTo(map);      
        markers.push({
          id: markerSelected._leaflet_id,
          marker: markerSelected
        });
    }
    else
    {
        map.setView([geoloc[0], geoloc[1]], Math.min(13, map.getZoom()));
    }
    var centroid = new L.Marker(new L.LatLng(geoloc[0], geoloc[1]), {icon: centroidIcon});
    markers.push(centroid);
    centroid.addTo(map);

    map.on('click', this.onClickMap); 
   
    this.setState({map: map, markers: markers, select: select});
  },
  expand: function(index){
    var detail = this.state.detail;
    var select = this.state.select;
    if(detail !== null && 
      detail === index) {
      detail = null;
    }
    else if(detail !== null) {
      detail = index;
      select = index;
    } else {
      detail = index;
    }
    this.setState({detail: detail, select: select});
  },
  toggleMap: function(index){
    this.setState({selectMap: index});
  },
  onClickPreview: function(){
    alert('yo');
  },
  render: function() {

    var self = this;
    if(this.props.result.length===0) return "";

    var result = this.props.result;
    var detailMapJSX = "";
    if(this.state.selectMap !== null){
    
      detailMapJSX = (
        <div id="popup" zDepth={1} className="text-center">
          <a href="javascript:;" className="noRef clickable" onClick={self.onClickPreview}>
            <Preview object={result.objects[this.state.selectMap]} select={self.select} index={this.state.selectMap} />
          </a>
        </div>);
    }
    var nbResultJSX = "";
    if(result.objects.length){
      nbResultJSX = (<p id="nbResults">Il y a <strong>{result.objects.length}</strong> résultats pour votre recherche</p>);
    }
    return (
      <div flex layout="row">
        <md-content flex color={Colors.grey600} >
          {nbResultJSX}
          <MapCore getMapInfos={this.getMapInfos} result={result}/>
          {detailMapJSX}
        </md-content>
      </div>
    );
  }
});