"use strict";

var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var React = require('react');
var Tokens = require('../../Tokens.json');

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
        layers: [
                L.tileLayer(
                    'https://api.tiles.mapbox.com/v4/' +
                    Tokens.map_id +
                    '/{z}/{x}/{y}.png?access_token=' +
                    Tokens.mapbox_token, 
                    {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }
                )
            ],
        attributionControl: false,
        zoomControl: false,
    });
    map.setZoom(13);
    L.Icon.Default.imagePath = '/images-leaflet';
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