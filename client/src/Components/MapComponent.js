'use strict';

var React = require('react');
var L = require('leaflet');

var getColor = require('../getColor');

/*
interface MapComponent Props{
    mapBoxToken: string,
    mapId: string,
    mapCenter: [lat, lon],
    recyclingCenterMap : Map (RCId => RecyclingCenter),
    selectedID: RecyclingCenter ID
    onRecyclingCenterSelected(rc): void
}

interface MapComponent State{
    NONE
}
*/


var iconMap = new Map();
iconMap.set('recycling-center', 'flaticon-paris1 recycling-center');

module.exports = React.createClass({

    getInitialState: function(){
        return {};
    },

    componentDidMount: function(){
        // once React component mounted, create Leaflet map
        var self = this;
        this.map = L.map(this.getDOMNode(), {
            layers: [
                L.tileLayer(
                    'https://api.tiles.mapbox.com/v4/' +
                    this.props.mapId +
                    '/{z}/{x}/{y}.png?access_token=' +
                    this.props.mapBoxToken, 
                    {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }
                )
            ],
            attributionControl: false,
            center: this.props.mapCenter,
            zoom: 12
        });

        this.map.on('zoomend', function(){
            self.render();
        });
    },

    createRecyclingCenterMarker: function(recyclingCenter, size){

        var props = this.props;

        // check if recyclingCenter is selected, and define selectedClass
        var isSelected = this.props.selectedID === recyclingCenter.id;
        var classes = [
            'recyclingCenter',
            isSelected ? 'selected' : ''
        ];

        var position = L.latLng(Number(recyclingCenter.lat), Number(recyclingCenter.lon));

        // create Leaflet marker
        var marker = L.circleMarker(
            position,
            {
                // icon: myIcon,
                className: classes.join(' '),
                radius: size,
                fillColor: getColor(recyclingCenter.latest, recyclingCenter.max, 0)
            }
        );

        // add click event on marker
        marker.on('click', function(){
            console.log('click', recyclingCenter.name);
            props.onRecyclingCenterSelected(recyclingCenter);
        });

        return marker;
    },

    createRecyclingCenterName: function(recyclingCenter, zoom){

        var props = this.props;

        // check if recyclingCenter is selected, and define selectedClass
        var isSelected = this.props.selectedID === recyclingCenter.id;

        var selectedClass = isSelected ? ' selected' : '';
        var className = 'recyclingCenterName' + selectedClass;

        var position = L.latLng(Number(recyclingCenter.lat), Number(recyclingCenter.lon));

        // this is dirty, but i'm dirty anyway so it don't matter dude
        var myIcon = L.divIcon({
            className: className,
            iconSize: ['auto', 'auto'],
            iconAnchor: [-12, 15],
            html: recyclingCenter.name
        });

        // create Leaflet marker
        var marker = L.marker(
            position,
            {
                icon: myIcon
            }
        );

        // add click event on marker
        marker.on('click', function(){
            props.onRecyclingCenterSelected(recyclingCenter);
        });

        return marker;
    },

    render: function() {
        var self = this;
        var props = this.props;
        var map = this.map;

        if(map){
            // remove all markers to avoid superposition
            if (this.recyclingCenterLayer)
                map.removeLayer(this.recyclingCenterLayer);
            if (this.nameLayer)
                map.removeLayer(this.nameLayer);

            var zoom = map.getZoom();

            // var size = Math.max(2, 2*(zoom-7));
            var size = 7;

            // create recyclingCenter markers
            var recyclingCenterMarkers = [];
            var nameMarkers = [];

            if(props.recyclingCenterMap){
                props.recyclingCenterMap.forEach(function(recyclingCenter){
                    if (zoom > 11) {
                        size = 10;
                        var name = self.createRecyclingCenterName(recyclingCenter, zoom);
                        nameMarkers.push(name); 
                    }   

                    var marker = self.createRecyclingCenterMarker(recyclingCenter, size);
                    recyclingCenterMarkers.push(marker);
                });

                //console.log("recyclingCenterMarkers", recyclingCenterMarkers);

                this.recyclingCenterLayer = L.layerGroup(recyclingCenterMarkers);
                this.nameLayer = L.layerGroup(nameMarkers);
                
                this.recyclingCenterLayer.addTo(map);
                this.nameLayer.addTo(map);

                this.recyclingCenterLayer.getLayers().forEach(function(marker){
                    marker.bringToFront();
                });
            }
            
        }

        var logo = React.DOM.img({
            id: 'logomap',
            src: '/images/Logo_marge.png'}
        );

        /*var colorLegend = ColorSwatches({
            colors : colorScale,
            min: min,
            max: max
            //title: self.state.colorLegendCaptions.title,
        });*/

        return React.DOM.div({id: 'map'},
            logo/*,
            colorLegend*/
        );

    }

});
