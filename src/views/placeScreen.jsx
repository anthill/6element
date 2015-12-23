"use strict";

var React = require('react');
var Mui = require('material-ui');
var page = require('page');
var queryString = require('query-string');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');

var MapView = require('./mapView');
var DetailView = require('./detailView');

var search = require('../js/prepareServerAPI')(require('../js/sendReq')).search;


//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

module.exports = React.createClass({
    getInitialState: function() {

        // List of networks from endpoint
        var filters = this.props.networks.map(function(network){
            return { name: network.name, color: network.color, checked: true };
        });
        return {
            parameters: {
            what:  this.props.category ?  this.props.categoriesFR.indexOf(this.props.category) : 0, 
            placeName: '', 
            geoloc: this.props.geoloc ? this.props.geoloc : {lat: 44.8404507, lon: -0.5704909} // Le Node centered
        },
            // First empty results to display
            result: { 
                categories: [this.props.categoriesEN[0]], 
                placeName: '',
                objects: [] 
            }, 
            filters: filters, 
            status: 2, // INI Status
            listMode: false,
            detailedObject: this.props.detailedObject
        };
        // STATUS Definition
        // -1- Empty map, Zoom 13, no BoundingBox, geoloc centered
        // -2- Filled map, no Zoom, BoudingBox, no centered
        // -3- Filled map, no Zoom, no BoundingBox, no centered
    },
    componentDidMount: function() {
        
        if(this.props.detailedObject)
            this.onShowDetail(this.props.detailedObject);
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
    },

    // Popup the detailed sheet of the clicked point
    onShowDetail: function(object){

        // Temporary hide the left panel
        if(!this.isStarting() && this.state.listMode)
            this.refs.panelLeft.display(object === null); 

        // this.setState({detailedObject: object});

    },
    onHideDetail: function(){
        // Temporary hide the left panel
        if(!this.isStarting() && this.state.listMode)
            this.refs.panelLeft.display(true); 

        window.history.back();
        // this.setState({detailedObject: undefined});
    },
    isStarting: function(){
        return this.state.status===1;
    },
    render: function() {

        // when user commes with a place url there is no back arrow to show
        var toolBarJSX =
            <div id="toolbar">
                <Mui.Toolbar>
                    <Mui.ToolbarGroup key={0} float="left" >
                        <Mui.IconButton onTouchTap={this.onHideDetail}>
                            <Mui.FontIcon className="material-icons" color={Colors.pink400} >arrow_back</Mui.FontIcon>
                        </Mui.IconButton>
                    </Mui.ToolbarGroup>
                </Mui.Toolbar>
            </div>

       
        // For serverside rendering (without components activated), 
        // we display a map picture on background
        var isLoaded = (this.props.googleMapsApi !== undefined);
        if(!isLoaded){
            return (
            <div flex layout="row">
                <md-content flex >
                    {toolBarJSX}
                    <div id="backgroundMap" />
                </md-content>
            </div>);
        }
 

        // List of points & Filters
        var result = JSON.parse(JSON.stringify(this.state.result));
        
        var detailedJSX = 
                <DetailView 
                    object={this.state.detailedObject} 
                    onShowDetail={this.onShowDetail} />
                        
        return (
            <div flex layout="row">
                <md-content flex >
                    {detailedJSX}
                    {toolBarJSX}
                </md-content>
            </div>
        );
    }
});