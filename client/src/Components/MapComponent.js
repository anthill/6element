'use strict';

var React = require('react');
var L = require('leaflet');
/*
interface MapComponent Props{
    token: string,
}

interface MapComponent State{
    NONE
}
*/

// var myLines = utils.makeMap( lineDesc );
var PARIS_COORDS = [48.8567, 2.3508];

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
                L.tileLayer('https://api.tiles.mapbox.com/v4/anthill.e8d69669/{z}/{x}/{y}.png?access_token=' + this.props.token, {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ],
            attributionControl: false,
            center: PARIS_COORDS,
            zoom: 12
        });

        this.map.on('zoomend', function(){
            self.render();
        });
    },

    /*createRecyclingCenterMarker: function(recyclingCenter, size, min, max){

        var props = this.props;

        // check if recyclingCenter is selected, and define selectedClass
        var isSelected = this.props.selectedRecyclingCenter === recyclingCenter.id;
        var selectedClass = isSelected ? ' selected' : '';

        var className = 'recyclingCenter' + selectedClass;

        var position = L.latLng(Number(recyclingCenter.lat), Number(recyclingCenter.lon));

        var value = props.recyclingCenterEntriesMap.get(recyclingCenter.id);

        // create Leaflet marker
        var marker = L.circleMarker(
            position,
            {
                // icon: myIcon,
                className: className,
                radius: size,
                fillColor: utils.getColor(Math.log(value + 10), Math.log(max + 10), Math.log(min + 10))
            }
        );

        // add click event on marker
        marker.on('click', function(){
            props.onRecyclingCenterClick(recyclingCenter.id);
        });

        return marker;
    },

    createRecyclingCenterName: function(recyclingCenter, zoom){

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

        if (map){

            // console.log('MAP selected', props.selectedRecyclingCenter);

            // remove all markers to avoid superposition
            if (this.allMarkers)
                map.removeLayer(this.allMarkers);

            if (this.allLines)
                map.removeLayer(this.allLines);

            var zoom = map.getZoom();

            var size;

            if (zoom <= 10)
                size = 0;
            else if (zoom <= 12)
                size = 6;
            else
                size = 9;

            var min = 0;
            var max = 1;

            // create recyclingCenter markers
            var recyclingCenterMarkers = [];
            //var recyclingCenterInfoMarkers = [];

            props.recyclingCenters.forEach(function(recyclingCenter){
                var markers = self.createRecyclingCenterMarker(recyclingCenter, size, min, max);
                // if (zoom > 13){
                    var markersName = self.createRecyclingCenterName(recyclingCenter, zoom);
                    recyclingCenterMarkers.push(markersName);    
                // }
                    
                recyclingCenterMarkers.push(markers);    
            });


            this.allMarkers = L.layerGroup(
                recyclingCenterMarkers
            );
            // this.allLines = L.layerGroup(
            //     polylines
            // );

            //this.allLines.addTo(map);
            this.allMarkers.addTo(map);
            
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
