"use strict";

var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var React = require('react');

module.exports = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
  },
  componentDidMount: function() {
    var map = this.map = L.map(this.getDOMNode(), {
        minZoom: 12,
        maxZoom: 18,
        layers: [L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'})
        ],
        attributionControl: false,
        zoomControl: false,
    });
    map.setZoom(13);
    L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
    //new L.Control.Zoom({ position: 'topright' }).addTo(map);
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