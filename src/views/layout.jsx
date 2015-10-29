"use strict";

var React = require('react');
var L = require('leaflet');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');

var MapView = require('./mapView.jsx');
var DetailView = require('./detailView.jsx');
var PanelLeft = require('./panelLeft.jsx');
var PanelRight = require('./panelRight.jsx');
var DialogBox = require('./dialogBox.jsx');

var requestData = require('./../js/requestData.js');


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
    })
    return {
      parameters: {
        what: 0, 
        placeName: '', 
        geoloc: {lat: 44.8404507, lon: -0.5704909} // Le Node centered
      },
      // First empty results to display
      result: { 
        categories: [this.props.categoriesEN[0]], 
        placeName: '', 
        objects: [] 
      }, 
      filters: filters, 
      status: 1, // INI Status
      displayList: true
    };
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
  },
  // Display the left list panel
  handleLeftNav: function(e){
    this.refs.panelLeft.toggle();
    this.setState({displayList: !this.state.displayList});
  },
  // Display the right networks panel
  handleRightNav: function(e){
    this.refs.panelRight.toggle();
  },
  // popup the form dialog
  handleSearchNav: function(e){
    // Temporary hide the left panel
    if(this.state.status!==1 && this.state.displayList)
        this.refs.panelLeft.toggle(); 
    this.refs.dialogBox.show();
  },
  // Form submit
  submitParameters: function(parameters){
    this.refs.dialogBox.dismiss();
    // Re-Display the Temporary hidden the left panel
    if(this.state.status!==1 && this.state.displayList)
        this.refs.panelLeft.toggle(); 
    this.onSearch(parameters, null, 2);// BOUNDING-BOX = NULL, STATUS = 2
  },
  cancelDialog: function(){
    this.refs.dialogBox.dismiss();
    // Re-Display the Temporary hidden the left panel
    if(this.state.status!==1 && this.state.displayList)
        this.refs.panelLeft.toggle(); 
  },
  // Search request from 2 actions
  // - Form submit
  // - map moves (drag or zoom)
  onSearch: function(parameters, boundingBox, status){

    var self = this; 
    var data = {
      'placeName': parameters.placeName,
      'categories': [this.props.categoriesEN[parameters.what]],
      'geoloc': parameters.geoloc,
      'boundingBox': boundingBox
    };

    requestData(data)
    .then(function(result){
      self.setState({
        parameters: parameters,
        result: result, 
        status: status
      });
    })
    .catch(function(error){
      console.log(error);
    });
  },
  // Check on filters (fired by the right networks panel)
  onSelectFilter: function(e){
    var filters = this.state.filters;
    filters.forEach(function(filter){
      filter.checked = false;
    });
    e.forEach(function(row){
     filters[row].checked = true;
    });
    this.setState({filters: filters});
  },
  // Popup the detailed sheet of the clicked point
  onShowDetail: function(object){
    // Temporary hide the left panel
    if(this.state.status!==1 && this.state.displayList)
        this.refs.panelLeft.toggle(); 
    this.setState({detailedObject: object});
  },
  render: function() {
 
    // List of points & Filters
    var result = JSON.parse(JSON.stringify(this.state.result));

    // If a point has been selected, we popup a detailed sheet
    var showDetail = (this.state.detailedObject !== null &&
      typeof this.state.detailedObject !== 'undefined');

    
    var detailedJSX = showDetail ? (
        <DetailView 
          object={this.state.detailedObject} 
          onShowDetail={this.onShowDetail} />) : "";

    var ttStyle = {'zIndex': 100};

    var toolBarJSX =  showDetail ? (
        <div id="toolbar">
          <Mui.Toolbar>
            <Mui.ToolbarGroup key={0} float="left">
              <Mui.IconButton onTouchTap={this.onShowDetail.bind(this, null)}><Mui.FontIcon className="material-icons" color={Colors.pink400} >arrow_back</Mui.FontIcon></Mui.IconButton>
            </Mui.ToolbarGroup>
          </Mui.Toolbar>
        </div>
        ) : (
        <div id="toolbar">
          <Mui.Toolbar>
            <Mui.ToolbarGroup key={0} float="left">
              <Mui.ToolbarTitle text="6element" />
            </Mui.ToolbarGroup>
            <Mui.ToolbarGroup key={1} float="right">
              <Mui.IconButton tooltip={this.state.displayList?"Afficher la carte":"Afficher la liste"} tooltipStyles={ttStyle} onTouchTap={this.handleLeftNav}><Mui.FontIcon className="material-icons" color={Colors.pink400} >{this.state.displayList?"map":"storage"}</Mui.FontIcon></Mui.IconButton>
              <Mui.IconButton tooltip="Rechercher"  tooltipStyles={ttStyle} onTouchTap={this.handleSearchNav}><Mui.FontIcon className="material-icons" color={Colors.pink400} >search</Mui.FontIcon></Mui.IconButton>
              <Mui.IconButton tooltip="Filtrer par source"  tooltipStyles={ttStyle} onTouchTap={this.handleRightNav}><Mui.FontIcon className="material-icons" color={Colors.pink400} >filter_list</Mui.FontIcon></Mui.IconButton>
            </Mui.ToolbarGroup>
          </Mui.Toolbar>
        </div>);
            
    return (
      <div flex layout="row">
        <md-content flex color={Colors.white} >
          {detailedJSX}
          {toolBarJSX}
          <Mui.Paper>
            <MapView 
              status={this.state.status} 
              result={result} 
              filters={this.state.filters} 
              parameters={this.state.parameters} 
              onShowDetail={this.onShowDetail} 
              onSearch={this.onSearch}
              showHeaderAndFooter={!showDetail}
              hideListIfDisplayed={this.state.displayList?this.handleLeftNav:null} />
            <PanelLeft 
              ref="panelLeft"
              filters={this.state.filters} 
              onShowDetail={this.onShowDetail} 
              visibility={(this.state.status!==1 && !showDetail)?'visible':'hidden'}
              displayList={this.state.displayList}
              result={result} />
             <PanelRight 
              ref="panelRight"
              filters={this.state.filters}
              onSelectFilter={this.onSelectFilter} />
            <DialogBox
              ref="dialogBox"
              status={this.state.status}
              categoriesFR={this.props.categoriesFR}
              parameters={this.state.parameters}
              submitParameters={this.submitParameters}
              cancelDialog={this.cancelDialog} />
          </Mui.Paper>
        </md-content>
      </div>
    );
  }
});