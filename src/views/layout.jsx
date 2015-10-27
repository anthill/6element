"use strict";

var $ = require('jquery');
var React = require('react');
var L = require('leaflet');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');

var MapView = require('./mapView.jsx');
var DetailView = require('./detailView.jsx');

var Tokens = require('../../Tokens.json');
var mapsApi = require( 'google-maps-api' )(  Tokens.google_token, ['places']);
var requestData = require('./../js/requestData.js');


//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

module.exports = React.createClass({
  getInitialState: function() {
    //var str = '{"type":"Feature","properties":{"dechet_non_dangereux":1,"name":"Déchèterie de Bordeaux Deschamps-bastide","menage":1,"opening_hours":"Apr 01-Sep 30 09:00-12:30,13:15-19:00; Oct 01-Apr 01 09:00-12:30,13:15-18:00","phone":"05 56 40 21 41","objects":{"rubble":0,"waste_medical":0,"batteries":1,"paper":1,"magazines":0,"white_goods":1,"waste_oil":1,"green_waste":1,"garden_waste":0,"hazardous_waste":1,"printer_toner":0,"scrap_metal":1,"plastic":0,"paint":1,"wood":1,"scrap_ concrete":1,"light_bulbs":0,"waste":1,"plastic_packaging":0,"scrap_metal_no_iron":1,"glass":1,"cardboard":1,"tyres":0,"waste_farming_chemical":1,"waste_mix_chemical":1,"beverage_carton":1,"fat_corp":0,"engine_oil":0,"newspaper":0,"waste_asbestos":0,"medical":0,"clothes":0},"address_1":"Quai Deschamps","address_2":"33100 - Bordeaux","owner":"Sinoe","dechet_dangereux":1,"type":"centre","dechet_inerte":0,"entreprise":0},"geometry":{"type":"Point","coordinates":{"lat":44.83401,"lon":-0.55198}},"distance":3.3535893441212057,"color":"#077527","file":"dechetterie_gironde.json","rate":2}';
    //, detailedObject: JSON.parse(str)
    // First empty results to display
    var iniResult = { categories: [this.props.categoriesEN[0]], placeName: '', objects: [] }
    // List of networks from endpoint
    var files = this.props.networks.map(function(network){
        return { name: network.name, color: network.color, checked: true };
    })
    return {
      what: 0, 
      placeName: iniResult.placeName, 
      result: iniResult, 
      files: files, 
      geoloc: {lat: 44.8404507, lon: -0.5704909}, // Le Node centered
      status: 1 // INI Status
    };
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
  },
  // Plug the 'where' form field to Google Autocomplete API
  onShowDialog: function(){
    var self = this;
    var where = React.findDOMNode(this.refs.whereField);
    var val = React.findDOMNode($(where).find('input')[0]);
    mapsApi().then(function( maps ) {
      var autocomplete = new maps.places.Autocomplete(val, { types: ['geocode'] });
      maps.event.addListener(autocomplete, 'place_changed', function(){
        var place = autocomplete.getPlace();
        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }
        self.setState({geoloc: {lat: place.geometry.location.lat(), lon: place.geometry.location.lng()}, placeName: address})
      });
    });
  },
  // Display the right networks panel
  handleLeftNav: function(e){
    this.refs.leftNav.toggle();
  },
  // popup the form dialog
  handleSearchNav: function(e){
    this.refs.dialog.show();
  },
  // Form submit
  onDialogSubmit: function(e){
    this.refs.dialog.dismiss();
    this.onSearch(this.state.geoloc,null,2);
  },
  // Search request from 2 actions
  // - Form submit
  // - map moves (drag or zoom)
  onSearch: function(geoloc, boundingBox, status){

    var self = this; 
    var data = {
      'placeName': this.state.placeName,
      'categories': [this.props.categoriesEN[this.state.what]],
      'geoloc': geoloc,
      'boundingBox': boundingBox
    };

    requestData(data)
    .then(function(result){
      self.setState({result: result, status: status});
    })
    .catch(function(error){
      console.log(error);
    });
  },
  // Change in the what bar
  handleSelectWhat: function(e){
    this.setState({
      what: e.target.value
    });
  },
  // Check on filters in the right networks panel
  onSelectFilter: function(e){
    var files = this.state.files;
    files.forEach(function(file){
      file.checked = false;
    });
    e.forEach(function(row){
     files[row].checked = true;
    });
    this.setState({files: files});
  },
  // Popup the detailed sheet of the clicked point
  onShowDetail: function(object){
    this.setState({detailedObject: object});
  },
  render: function() {
    // Sample code for tests layout designs
    /*
    return (
      <div flex layout="row">
        <md-content flex color={Colors.white} >
          <Mui.Paper id="sheet">
            <Mui.Toolbar >
              <Mui.ToolbarGroup key={0} float="left">
                <Mui.ToolbarTitle text="6element" />
              </Mui.ToolbarGroup>
            </Mui.Toolbar>
            Lalala
          </Mui.Paper>
        </md-content>
      </div>
    );*/

    // If a point has been selected, we popup a detailed sheet
    var toolBarJSX = "";
    var detailedJSX = "";
    var showDetail = false;
    if(this.state.detailedObject !== null &&
      typeof this.state.detailedObject !== 'undefined'){
    
      detailedJSX = (
        <DetailView 
          object={this.state.detailedObject} 
          onShowDetail={this.onShowDetail} />);

      toolBarJSX = (
        <div id="toolbar">
          <Mui.Toolbar id="toolbar">
            <Mui.ToolbarGroup key={0} float="left">
              <Mui.IconButton onTouchTap={this.onShowDetail.bind(this, null)}><Mui.FontIcon className="material-icons" color={Colors.pink400} >arrow_back</Mui.FontIcon></Mui.IconButton>
            </Mui.ToolbarGroup>
          </Mui.Toolbar>
        </div>);
      showDetail = true;
    }
    else
    {
      toolBarJSX = (
        <div id="toolbar">
          <Mui.Toolbar>
            <Mui.ToolbarGroup key={0} float="left">
              <Mui.ToolbarTitle text="6element" />
            </Mui.ToolbarGroup>
            <Mui.ToolbarGroup key={1} float="right">
              <Mui.IconButton tooltip="Afficher par Liste"><Mui.FontIcon className="material-icons" color={Colors.pink400} >dvr</Mui.FontIcon></Mui.IconButton>
              <Mui.IconButton tooltip="Afficher mes Favoris"><Mui.FontIcon className="material-icons">favorite</Mui.FontIcon></Mui.IconButton>
              <Mui.IconButton tooltip="Rechercher" onTouchTap={this.handleSearchNav}><Mui.FontIcon className="material-icons" color={Colors.pink400} >search</Mui.FontIcon></Mui.IconButton>
              <Mui.IconButton tooltip="Filtrer par source" onTouchTap={this.handleLeftNav}><Mui.FontIcon className="material-icons" color={Colors.pink400} >filter_list</Mui.FontIcon></Mui.IconButton>
            </Mui.ToolbarGroup>
          </Mui.Toolbar>
        </div>);
    }

    // * Menus items & options *    
    var menuItems = [];
    var standardActions = [ { text: 'Valider', onTouchTap: this.onDialogSubmit, ref: 'submit' }, ];
    var whatOptions = this.props.categoriesFR.map(function(category, index){
      return { payload: index, text: category };
    });
        
    // List of points & Filters
    var result = JSON.parse(JSON.stringify(this.state.result));
    
    var resultJSX = "";
    var filterJSX = "";
    if(result){

      // Map component
      resultJSX = (
        <MapView 
          status={this.state.status} 
          result={result} 
          files={this.state.files} 
          geoloc={this.state.geoloc} 
          onShowDetail={this.onShowDetail} 
          onSearch={this.onSearch}
          showHeaderAndFooter={!showDetail} />);
      
      // Panel list
      filterJSX = this.state.files.map(function(file, id){
        return (
          <Mui.TableRow key={'filter'+id.toString()} selected={file.checked} style={{width: "100%"}}>
            <Mui.TableRowColumn style={{padding: "10px"}}>{file.name}</Mui.TableRowColumn>
            <Mui.TableRowColumn style={{maxWidth: "24px", padding: "0"}}>
              <Mui.FontIcon className="material-icons" color={file.color}>lens</Mui.FontIcon>
            </Mui.TableRowColumn>
          </Mui.TableRow>);
      });
    }
       
    // Panel component
    var panelJSX = (
      <Mui.Table 
        fixedHeader={false}
        fixedFooter={false}
        selectable={true}
        multiSelectable={true}
        onRowSelection={this.onSelectFilter}
        style={{width: "100%"}}>
        <Mui.TableHeader enableSelectAll={false} displaySelectAll={false} style={{width: "100%"}}>
          <Mui.TableRow>
            <Mui.TableHeaderColumn style={{paddingRight: "5px"}}>Source</Mui.TableHeaderColumn>
            <Mui.TableHeaderColumn style={{width: "24px", paddingRight: "5"}}></Mui.TableHeaderColumn>
          </Mui.TableRow>
        </Mui.TableHeader>
        <Mui.TableBody 
          deselectOnClickaway={false}
          showRowHover={true}
          stripedRows={false}
          style={{width: "100%"}}>
          {filterJSX}
        </Mui.TableBody>
      </Mui.Table>);
    
    return (
      <div flex layout="row">
        <md-content flex color={Colors.white} >
          {detailedJSX}
          {toolBarJSX}
          <Mui.Paper>
            {resultJSX}
            <Mui.LeftNav ref="leftNav" docked={false} openRight={true} menuItems={menuItems} header={panelJSX} />
            <Mui.Dialog
              ref="dialog"
              title="6element"
              actions={standardActions}
              actionFocus="submit"
              modal={true}
              onShow={this.onShowDialog}
              openImmediately={this.state.status===1}
              autoDetectWindowHeight={true} 
              autoScrollBodyContent={true}
              contentStyle={{maxWidth: '420px'}}>
              <div>
                <table width="100%">
                  <tr>
                    <td><Mui.FontIcon className="material-icons" color={Colors.grey600} >description</Mui.FontIcon></td>
                    <td>
                      <Mui.SelectField
                        ref="whatField"
                        selectedIndex={this.state.what}
                        onChange= {this.handleSelectWhat}
                        fullWidth={true}
                        menuItems={whatOptions} />
                    </td>
                  </tr>
                  <tr>
                    <td><Mui.FontIcon className="material-icons" color={Colors.grey600} >room</Mui.FontIcon></td>
                    <td>
                      <Mui.TextField
                        defaultValue={this.state.placeName}
                        ref="whereField" 
                        fullWidth={true}/>
                    </td>  
                  </tr>
                </table>
              </div>
            </Mui.Dialog>
          </Mui.Paper>
        </md-content>
      </div>
    );
  }
});