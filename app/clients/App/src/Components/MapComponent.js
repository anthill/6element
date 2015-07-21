'use strict';

var React = require('react');
var L = require('leaflet');

var getColor = require('../getColor');

/*
interface MapComponent Props{
    mapBoxToken: string,
    mapId: string,
    mapCenter: [lat, lon],
    placeMap : Map (placeID => place),
    selectedPlaceMap: Map (placeID => selectedPlace ID),
    onPlaceSelected(place): void,
    updatingIDs: int
}

interface MapComponent State{
    NONE
}
*/


var iconMap = new Map();
iconMap.set('place', 'flaticon-paris1 place');

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
            zoom: 10
        });

        this.map.on('zoomend', function(){
            self.render();
        });
    },

    createPlaceMarker: function(place, size){

        var props = this.props;

        // check if place is selected, and define selectedClass
        var isSelected = props.selectedPlaceMap.has(place.id);
        var isUpdating = props.updatingIDs.indexOf(place.id) !== -1;

        var classes = [
            'place',
            isSelected ? 'selected' : '',
            isUpdating ? 'updating' : ''
        ];

        var position = L.latLng(Number(place.lat), Number(place.lon));

        // create Leaflet markers
        var marker = L.circleMarker(
            position,
            {
                // icon: myIcon,
                className: classes.join(' '),
                radius: size,
                fillColor: getColor(place.latest, place.max, 0)
            }
        );

        // add click event on marker
        marker.on('click', function(){
            console.log('click', place.name);
            props.onPlaceSelected(place);
        });

        return marker;
    },

    createPlaceName: function(place, zoom){

        var props = this.props;

        // check if place is selected, and define selectedClas
        var isSelected = props.selectedPlaceMap.has(place.id);
        var isUpdating = props.updatingIDs.indexOf(place.id) !== -1;

        var classes = [
            'placeName',
            isSelected ? 'selected' : '',
            isUpdating ? 'updating' : ''
        ];

        var position = L.latLng(Number(place.lat), Number(place.lon));

        // this is dirty, but i'm dirty anyway so it don't matter dude
        var myIcon = L.divIcon({
            className: classes.join(' '),
            iconSize: ['auto', 'auto'],
            iconAnchor: [-12, 15],
            html: place.name
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
            props.onPlaceSelected(place);
        });

        return marker;
    },

    render: function() {
        var self = this;
        var props = this.props;
        var map = this.map;

        console.log('MAP props', props);

        if(map){
            // remove all markers to avoid superposition
            if (this.placeLayer)
                map.removeLayer(this.placeLayer);
            if (this.nameLayer)
                map.removeLayer(this.nameLayer);

            var zoom = map.getZoom();

            // var size = Math.max(2, 2*(zoom-7));
            var size = 7;

            // create place markers
            var placeMarkers = [];
            var nameMarkers = [];

            if(props.placeMap){
                props.placeMap.forEach(function(place){
                    if (zoom > 11) {
                        size = 10;
                        var name = self.createPlaceName(place, zoom);
                        nameMarkers.push(name); 
                    }   

                    var marker = self.createPlaceMarker(place, size);

                    placeMarkers.push(marker);
                });

                this.placeLayer = L.layerGroup(placeMarkers);
                this.nameLayer = L.layerGroup(nameMarkers);
                
                this.placeLayer.addTo(map);
                this.nameLayer.addTo(map);

                this.placeLayer.getLayers().forEach(function(marker){
                    marker.bringToFront();
                });
            }
            
        }

        var logo = React.DOM.img({
            id: 'logomap',
            src: '/Map/images/Logo_marge.png'}
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
