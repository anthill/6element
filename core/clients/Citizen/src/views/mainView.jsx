"use strict";

var React = require('react');
var L = require('leaflet');

var TabView    =  require('./tabView.jsx');
var ListView    =  require('./listView.jsx');
var DetailView  =  require('./detailView.jsx');
var MapCore     =  require('./mapCore.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    var temp = [];
    var files = [];
    this.props.result.objects.forEach(function(object){
      if(temp.indexOf(object.file) ===-1){
        temp.push(object.file);       
        files.push({
          name: object.file.replace('.json', ''),
          color: object.color,
          checked: true
        }); 
      }
    });
    return {view: 0, map: null, markers: [], select: null, selectMap: null, files: files, detail: null};
  },
  getMapInfos: function(map){
    this.loadSelection(map, null, this.state.files);
  },
  select: function(index){
    this.loadSelection(this.state.map, index, this.state.files);
  },
  clickMarker: function(e){
    var index = this.state.markers.findIndex(function(marker){
      return (marker.id === e.target._leaflet_id)
    });
    if(index === -1) 
      this.toggleMap(null);
    else
      this.toggleMap(index);
    //console.log(index);
    //this.expand(index);
  },
  loadSelection: function(map, select, files){

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
    var list = [];
    this.state.files.forEach(function(file){
      if(file.checked === true) list.push(file.name);
    });
    console.log(list.length);
    this.props.result.objects.filter(function(object){
      var file = object.file.replace('.json', '');
      return (list.indexOf(file) !== -1);
    }).
    forEach(function(object, index){

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
            marker.on("click", self.clickMarker);
            map.setView([object.geometry.coordinates.lat, object.geometry.coordinates.lon], 16);
        } 
        else if (isCenter){
            var marker = new L.CircleMarker(new L.LatLng(object.geometry.coordinates.lat, object.geometry.coordinates.lon), options);
            marker.on("click", self.clickMarker);
            marker.addTo(map); 
            markers.push({
              id: marker._leaflet_id,
              marker: marker
            });
        }
        else{
            var marker = new L.Circle(new L.LatLng(object.geometry.coordinates.lat, object.geometry.coordinates.lon), 10, options);
            marker.addTo(map);
            marker.on("click", self.clickMarker);
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
   
    this.setState({map: map, markers: markers, select: select, files: files});
  },
  selectFile: function(index){
    var files = this.state.files;
    files[index].checked = !files[index].checked;
    this.loadSelection(this.state.map, null, files);
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
  changeView: function(view){
    this.setState({view: view});
  },
  render: function() {

    var self = this;
    if(this.props.result.length===0) return "";

    var iconsCheck = ["glyphicon-unchecked", "glyphicon-check"];
    var filesJSX = this.state.files.map(function(file, index){
      var style = { 
        'color': file.color,
      };
      return (
        <li key={'file'+index.toString()}>
          <a href="javascript:;">
            <span> 
              <i className={"legend-name clickable glyphicon "+iconsCheck[(file.checked?1:0)]} onClick={self.selectFile.bind(self, index)} > </i> 
              <i className={"legend glyphicon glyphicon-stop"} style={style}> </i> 
              {file.name}
            </span>
          </a>
        </li>
      );
    });
    var result = JSON.parse(JSON.stringify(this.props.result));
    var list = [];
    this.state.files.forEach(function(file){
      if(file.checked === true) list.push(file.name);
    });
    result.objects = this.props.result.objects.filter(function(object){
      var file = object.file.replace('.json', '');
      return (list.indexOf(file) !== -1);
    });


    var detailMapJSX = "";
    if(this.state.selectMap !== null){
    //if(false){
      detailMapJSX = (
        <div id="popup">
          <DetailView object={this.props.result.objects[this.state.selectMap]} isDetailed={true} select={self.select} index={this.state.selectMap} />
           <a href="javascript:;">
            <span onClick={self.toggleMap.bind(self, null)}>
              <i className="glyphicon glyphicon-triangle-bottom"></i>
            </span>
          </a>
        </div>);
    }
    var viewJSX = "";
    if(this.state.view === 0){
      viewJSX = (
        <ListView result={result} select={this.select} detail={this.state.detail} expand={this.expand} />
      );
    } else {
      viewJSX = (
        <div>
          <div id="mapBox" className="clearfix">
            <h4 id="nbResults">Il y a <strong>{result.objects.length}</strong> résultats pour votre recherche</h4>
            <MapCore getMapInfos={this.getMapInfos} result={result}/>
            {detailMapJSX}
          </div>
        </div>
      );
    }
    return (
        <div className="row">
          <div className="col-sm-3 pull-left text-left">
            <TabView changeView={this.changeView} view={this.state.view} /> 
            <ul id="listFiles">{filesJSX}</ul>
          </div>
          <div id="resultView" className="col-sm-9">
            {viewJSX}
          </div>
        </div>);
  }
});