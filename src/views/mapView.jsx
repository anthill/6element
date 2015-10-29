"use strict";
var React = require('react');
var Mui = require('material-ui');
var IconPulse = require('../js/L.Icon.Pulse.js');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var L = require('leaflet');
var Colors = require('material-ui/lib/styles/colors');
var Preview  =  require('./preview.jsx');
var MapCore  =  require('./mapCore.jsx');


module.exports = React.createClass({
  getInitialState: function() {
    return {map: null, markers: [], selected: null, markersLayer: undefined};
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
  },
  getMapInfos: function(map){
    this.loadSelection(map, 1, this.props.result.objects, this.props.filters, this.props.parameters.geoloc, null);
  },
  onClickPreview: function(){
    var self = this;
    if(this.state.selected === null) return;
    var index = this.props.result.objects.findIndex(function(object){
      return object.properties.id === self.state.selected;
    });
    if(index === -1) this.setState({selected: null});
    else this.props.onShowDetail(this.props.result.objects[index]);
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
    if(this.state.map !== null){
      var bounds = this.state.map.getBounds(); 
      var box = {
        'maxLat': bounds.getNorth(),
        'minLat': bounds.getSouth(),
        'maxLon': bounds.getEast(),
        'minLon': bounds.getWest()
      }
      this.props.onSearch(this.props.parameters, box, 3);
    }
  },
  componentWillReceiveProps: function(nextProps){
    if( this.state.map !== null &&
        nextProps.status !== 1){
      this.loadSelection( this.state.map, 
                          nextProps.status, 
                          nextProps.result.objects, 
                          nextProps.filters, 
                          nextProps.parameters.geoloc, 
                          this.state.selected);
    }
  },
  loadSelection: function(map, status, points, filters, center, selected ){
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
      map.setView([center.lat, center.lon], Math.min(13, map.getZoom()));
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
        var hasSensor = (point.properties.sensor_id !== null);
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
        if(hasSensor && typeof point.measurements !== 'undefined'){

          var value = point.measurements;
          var color = 'green';
          if(value > 0.5 && value <= 0.75) color = 'orange';
          else if(value > 0.75) color = 'red';

          var pulsingIcon = new IconPulse({iconSize:[20,20],fillColor: point.color,pulseColor: color});
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
  
    if(status === 2 && points.length > 0){
        
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
    
    var markersLayer = L.layerGroup(markers);
    map.addLayer(markersLayer);
    this.setState({map: map, markersLayer: markersLayer, selected: selected});
  },
  render: function() {
    var self = this;
    if(this.props.result.length===0) return "";
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
              <a href="javascript:;" className="noRef clickable" onClick={this.onClickPreview}>
                <Preview object={result.objects[index]} />
              </a>
            </div>
          </div>);
      }
    }
    var nbResultJSX = "";
    if(this.props.showHeaderAndFooter && 
      result.objects.length !== 0){
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
      nbResultJSX = (<div className="fixedHeader"><div id="nbResults"><p>Il y a <strong>{nbResults}</strong> résultat{nbResults>1?'s':''} pour votre recherche</p></div></div>);
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