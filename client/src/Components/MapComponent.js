'use strict';

var React = require('react');
var L = require('leaflet');

var getColor = require('../getColor');

/*
interface MapComponent Props{
    mapBoxToken: string,
    mapId: string,
    mapCenter: [lat, lon],
    recyclingCenters
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
        var isSelected = this.props.selectedRecyclingCenter === recyclingCenter.id;
        var classes = [
            'recyclingCenter',
            isSelected ? 'selected' : ''
        ];

        var position = L.latLng(Number(recyclingCenter.lat), Number(recyclingCenter.lon));

        console.log('recyclingCenter', recyclingCenter)
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
            props.onRecyclingCenterClick(recyclingCenter.id);
        });

        return marker;
    },

    /*createRecyclingCenterName: function(recyclingCenter, zoom){

        var props = this.props;

        // check if recyclingCenter is selected, and define selectedClass
        var isSelected = this.props.selectedRecyclingCenter === recyclingCenter.id;
        var isDisplayed = zoom > 14;
        var selectedClass = isSelected ? ' selected' : '';
        var displayedClass = isDisplayed? ' displayed' : '';

        var className = 'recyclingCenterName' + selectedClass + displayedClass;

        var position = L.latLng(Number(recyclingCenter.lat), Number(recyclingCenter.lon));

        var value = props.recyclingCenterEntriesMap.get(recyclingCenter.id);

        // this is dirty, but i'm dirty anyway so it don't matter dude
        var myIcon = L.divIcon({
            className: className,
            iconSize: [300, 10],
            iconAnchor: [-12, 8],
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
            props.onRecyclingCenterClick(RecyclingCenter.id);
        });

        return marker;
    },

    createLine: function(line){
        var props = this.props;

        //console.log('CREATE LINE:', line.id, line.recyclingCenter);

        var route = [];
        line.recyclingCenters.forEach(function(id){
            if (props.recyclingCenters.has(id)){
                var currentRecyclingCenter = props.recyclingCenters.get(id);
                var position = L.latLng(currentRecyclingCenter.lat, currentRecyclingCenter.lon);
                route.push(position);
            } else {
                console.log("Missing recyclingCenter to build line");
            }
            
        });

        var polyline = L.polyline(route, {
            className: 'line',
            color: line.color,
            opacity: 1
        });

        polyline.on('click', function(){
            console.log(line.id);
        })

        return polyline;
    },*/

    render: function() {
        var self = this;
        var props = this.props;
        var map = this.map;

        if(map){
            console.log('MAP selected', props.recyclingCenter);

            // remove all markers to avoid superposition
            if (this.allMarkers)
                map.removeLayer(this.allMarkers);

            var zoom = map.getZoom();

            var size = Math.max(2, 2*(zoom-7));

            // create recyclingCenter markers
            var recyclingCenterMarkers = [];

            console.log('props', props);
            if(props.recyclingCenters){
                props.recyclingCenters.forEach(function(recyclingCenter){
                    var marker = self.createRecyclingCenterMarker(recyclingCenter, size);
                    // if (zoom > 13){
                        //var markersName = self.createRecyclingCenterName(recyclingCenter, zoom);
                        //recyclingCenterMarkers.push(markersName);    
                    // }

                    recyclingCenterMarkers.push(marker);    
                });

                console.log("recyclingCenterMarkers", recyclingCenterMarkers);

                this.allMarkers = L.layerGroup(
                    recyclingCenterMarkers
                );
                
                this.allMarkers.addTo(map);
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
