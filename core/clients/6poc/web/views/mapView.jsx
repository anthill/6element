"use strict";

var React = require('react');
var L = require('leaflet');

module.exports = React.createClass({
  getInitialState: function() {
    return {map: null, markers: [], select: null};
  },
  getMapInfos: function(map){
    this.loadSelection(map, null);
  },
  select: function(index){
    this.loadSelection(this.state.map, index);
  },
  loadSelection: function(map, select){

    var self = this;
    // Adding icons
    var CentroidIcon = L.Icon.Default.extend({
      options: {
        imagePath:    '/img/centroid.png',
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
        imagePath:    '/img/centroid.png',
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
    this.props.result.objects.forEach(function(object, index){

        var isSelected = (select !== null && select === index);
      
        var options = {
            color: (isSelected?'red':'blue'),
            fillColor: (isSelected?'red':'blue'), 
            fillOpacity: 0.7,
            weight:(isSelected?'10px':'5px'),
            clickable: false
        };

        if(isSelected){
            markerSelected = new L.Marker(new L.LatLng(object.geometry.coordinates.lat, object.geometry.coordinates.lon), {icon: pingIcon});      
            map.setView([object.geometry.coordinates.lat, object.geometry.coordinates.lon], 16);
        } 
        else{
            var marker = new L.Circle(new L.LatLng(object.geometry.coordinates.lat, object.geometry.coordinates.lon), 10, options);
            markers.push(marker);
            marker.addTo(map);
        } 
    });
    var geoloc = this.props.result.geoloc;
    if(markerSelected !== null){
        markers.push(markerSelected);
        markerSelected.addTo(map);      
    }
    else
    {
        map.setView([geoloc[0], geoloc[1]], 13);
    }
    var centroid = new L.Marker(new L.LatLng(geoloc[0], geoloc[1]), {icon: centroidIcon});
    markers.push(centroid);
    centroid.addTo(map);

    this.setState({map: map, markers: markers, select: select});
  },
  render: function() {

    if(this.props.result.length===0) return "";
    
    return (
        <div id="resultView" className="row">
            <ListView result={this.props.result} select={this.select}/>
            <div className="col-lg-6">
                <h4 id="nbResults">Il y a <strong>{this.props.result.objects.length}</strong> résultats pour votre recherche</h4>
                <MapCore zoom={12} getMapInfos={this.getMapInfos} result={this.props.result}/>
            </div>
        </div>);
  }
});

var ListView = React.createClass({
  getInitialState: function() {
    return {tab: 0, sort: 1, filterDisplayed: false};
  },
  select: function(index){
    this.props.select(index);
  },
  sort: function(sort){
    this.setState({sort: sort, tab: 0});
  },
  displayFilter: function(display){
    this.setState({filterDisplayed: display});
  },
  postAdvert: function(){
    alert("TODO Bro!");
  },
  render: function() {

    if(this.props.result.length===0) return "";
    var self = this;
    var starJSX = (<span className="glyphicon glyphicon-star star"></span>);

    var labelsSort = ["Pertinence","Distance"];
    var navTypeSortJSX = (
      <div>
        <select className="form-control input-sm">
          <option>pertinence</option>
          <option>distance</option> 
        </select>
      </div>
    );

    var  navSortJSX = (
      <div className="btn-group dropdown" id="groupSort">
        <button type="button" className="form-control dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <strong>Tri | {labelsSort[this.state.sort]}</strong> <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="groupSort">
          <li className={this.state.sort===0?"active":""}><a href="javascript:;" onClick={this.sort.bind(this,0)}>par Pertinence</a></li>
          <li className={this.state.sort===1?"active":""}><a href="javascript:;" onClick={this.sort.bind(this,1)}>par Distance</a></li>
        </ul>
      </div>
    );
   
    var objects = this.props.result.objects;
    var listJSX = objects
    .sort(function(o1, o2){
      return (o1.distance-o2.distance);
    })
    .slice(0,30)
    .map(function(object, index){

      var phoneJSX = "";
      if(object.properties.phone){
        phoneJSX =  <div><abbr title="phone">T:</abbr> {object.properties.phone}<br/></div>
      } 
      var list = [];
      for (var key in object.properties.objects) {
          if (object.properties.objects.hasOwnProperty(key)) {
            if(object.properties.objects[key] === 1)
              list.push(key);
        }
      }
      var distance = "";
      if(object.distance > 1){
        distance = (Math.round(object.distance * 100) / 100).toString() + " Km";
      }
      else {
        distance = (Math.round(object.distance * 1000)).toString() + " m";
      }
      var allowedJSX = list
      .map(function(type){
        return (<li>{type}</li>);
      })
      
      return (
        <div className="">
          <div className="panel panel-default">
            <div className="panel-body">
              <div className="row">
                <div className="col-lg-6 text-left">
                  <address>
                    <strong>{object.properties.name}</strong><br/>
                    {object.properties.address_1}<br/>
                    {object.properties.address_2}<br/>
                    {phoneJSX}
                    <h4 className="distance"><small><em><i className="text-left glyphicon glyphicon-map-marker"></i> {distance} </em></small></h4>
                    <p><a href="javascript:;" onClick={self.select.bind(self, index)}>Localiser sur la carte</a>
                    </p>
                  </address>
                </div>
                <div className="col-lg-6">
                  <div className="pull-right">{starJSX}{starJSX}{starJSX}{starJSX}{starJSX}</div>
                  <div className="pull-left">
                    <ul id="allowedObjects">
                      {allowedJSX}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
   
    return (
      <div className="col-lg-6">
        <div className="clearfix">
          <div className="pull-left">{navSortJSX}</div>
        </div>
        <div id="listView">
            {listJSX}
        </div>
        <div id="postAdvert" className="navbar-form navbar-inverse" role="search">
          <div className="form-group">
            <label>Vous ne trouvez pas ? Déposez une annonce </label> 
            <button className="btn btn-primary" onClick={this.postAdvert}><a href="javascript:;" className="glyphicon glyphicon-pencil"></a></button>
          </div>
        </div>
      </div>                                              
    );
  }
});


var MapCore = React.createClass({
  componentDidMount: function() {
    var square = this.props.result.square;
    var map = this.map = L.map(this.getDOMNode(), {
        minZoom: 5,
        maxZoom: 20,
        layers: [L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'})
        ],
        attributionControl: false,
    });
    L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
    this.props.getMapInfos(map);
  },
  componentWillUnmount: function() {
      this.map = null;
  },
  render: function() {
    return (
        <div id='map'>
        </div>
    );
  }
});