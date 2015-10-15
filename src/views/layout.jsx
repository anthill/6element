"use strict";

var React = require('react');
var L = require('leaflet');
var MapView = require('./mapView.jsx');
var DetailView = require('./detailView.jsx');

var Mui = require('material-ui');
var Colors = require('material-ui/lib/styles/colors');
var $ = require('jquery');
var mapsApi = require( 'google-maps-api' )( 'AIzaSyCLuhubHWNbDgBhmj61OUo07L-zjHsVkKw' , ['places']);
var requestData = require('./../js/requestData.js');

var injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var availableCategories = [
      'All',
      'aluminium',
      'batteries',
      'beverage_carton',
      'bicycles',
      'books',
      'cans',
      'cardboard',
      'cds',
      'chipboard',
      'christmas_trees',
      'clothes',
      'computers',
      'cooking_oil',
      'cork',
      'engine_oil',
      'foil',
      'furniture',
      'glass',
      'glass_bottles',
      'green_waste',
      'garden_waste',
      'hardcode',
      'hazardous_waste',
      'light_bulbs',
      'magazines',
      'mobile_phones',
      'music',
      'newspaper',
      'organic',
      'paint',
      'paper',
      'paper_packaging',
      'plastic',
      'plastic_bags',
      'plastic_bottles',
      'plastic_packaging',
      'polyester',
      'printer_cartridges',
      'rubble',
      'scrap_metal',
      'sheet_metal',
      'shoes',
      'tyres',
      'waste',
      'waste_oil',
      'white_goods',
      'wood'];

module.exports = React.createClass({
  getInitialState: function() {
    var iniResult = {
        categories: ['All'],
        placeName: '',
        objects: []
    }
    //var str = '{"type":"Feature","properties":{"dechet_non_dangereux":1,"name":"Déchèterie de Bordeaux Deschamps-bastide","menage":1,"opening_hours":"Apr 01-Sep 30 09:00-12:30,13:15-19:00; Oct 01-Apr 01 09:00-12:30,13:15-18:00","phone":"05 56 40 21 41","objects":{"rubble":0,"waste_medical":0,"batteries":1,"paper":1,"magazines":0,"white_goods":1,"waste_oil":1,"green_waste":1,"garden_waste":0,"hazardous_waste":1,"printer_toner":0,"scrap_metal":1,"plastic":0,"paint":1,"wood":1,"scrap_ concrete":1,"light_bulbs":0,"waste":1,"plastic_packaging":0,"scrap_metal_no_iron":1,"glass":1,"cardboard":1,"tyres":0,"waste_farming_chemical":1,"waste_mix_chemical":1,"beverage_carton":1,"fat_corp":0,"engine_oil":0,"newspaper":0,"waste_asbestos":0,"medical":0,"clothes":0},"address_1":"Quai Deschamps","address_2":"33100 - Bordeaux","owner":"Sinoe","dechet_dangereux":1,"type":"centre","dechet_inerte":0,"entreprise":0},"geometry":{"type":"Point","coordinates":{"lat":44.83401,"lon":-0.55198}},"distance":3.3535893441212057,"color":"#077527","file":"dechetterie_gironde.json","rate":2}';
    //, detailedObject: JSON.parse(str)
    return {what: 'All', placeName: '', tab: 0, result: iniResult, files: [], geoloc: {lat: 44.8404507, lon: -0.5704909}, status: 1};
  },
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
  handleLeftNav: function(e){
    this.refs.leftNav.toggle();
  },
  handleSearchNav: function(e){
    this.refs.dialog.show();
  },
  onDialogSubmit: function(e){
    this.refs.dialog.dismiss();
    this.onSearch(this.state.geoloc,null,2);
  },
  onSearch: function(geoloc, boundingBox, status){

    var self = this;
    
    var data = {
      'placeName': this.state.placeName,
      'categories': [this.state.what],
      'geoloc': geoloc,
      'boundingBox': boundingBox
    };

    requestData(data)
    .then(function(result){
      var temp = [];
      var files = [];
      result.objects.forEach(function(object){
        if(temp.indexOf(object.file) ===-1){
          temp.push(object.file);       
          files.push({
            name: object.file,
            color: object.color,
            checked: true
          }); 
        }
      });

      self.setState({result: result, files: files, status: status});
    })
    .catch(function(error){
      console.error(error.status, error.message.toString());
    })    
  },
  handleSelectWhat: function(e){
    this.setState({
      what: availableCategories[e.target.value]
    });
  },
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
  onShowDetail: function(object){
    this.setState({detailedObject: object});
  },
  render: function() {
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

    if(this.state.detailedObject){
      return (<DetailView object={this.state.detailedObject} onShowDetail={this.onShowDetail} />);
    }
    
    var whatOptions = availableCategories.map(function(category, index){
      return { payload: index, text: category };
    });
    
    var menuItems = [];

    var iconMenuItems = [
      { payload: '1', text: 'Download' },
      { payload: '2', text: 'More Info' }
    ];
    //Standard Actions
    var standardActions = [
      { text: 'Valider', onTouchTap: this.onDialogSubmit, ref: 'submit' },
    ];
        
    var result = JSON.parse(JSON.stringify(this.state.result));
    var list = [];
    this.state.files.forEach(function(file){
      if(file.checked === true) list.push(file.name);
    });
    result.objects = result.objects.filter(function(object){
      var file = object.file.replace('.json', '');
      return (list.indexOf(file) !== -1);
    });
    
    var resultJSX = "";
    var filterJSX = "";
    if(result){
      resultJSX = (<MapView status={this.state.status} result={result} files={this.state.files} geoloc={this.state.geoloc} onShowDetail={this.onShowDetail} onSearch={this.onSearch} />);
      filterJSX = this.state.files.map(function(file){
        return (
          <Mui.TableRow selected={file.checked}>
            <Mui.TableRowColumn style={{padding: "10px"}}>{file.name}</Mui.TableRowColumn>
            <Mui.TableRowColumn style={{width: "24px", padding: "0px"}}>
              <Mui.FontIcon className="material-icons" color={file.color}>lens</Mui.FontIcon>
            </Mui.TableRowColumn>
          </Mui.TableRow>);
      });
    }
       
    var panelJSX = (
      <Mui.Table 
        fixedHeader={false}
        fixedFooter={false}
        selectable={true}
        multiSelectable={true}
        onRowSelection={this.onSelectFilter}>
        <Mui.TableHeader enableSelectAll={false} displaySelectAll={false}>
          <Mui.TableRow>
            <Mui.TableHeaderColumn>Source</Mui.TableHeaderColumn>
            <Mui.TableHeaderColumn></Mui.TableHeaderColumn>
          </Mui.TableRow>
        </Mui.TableHeader>
        <Mui.TableBody 
          deselectOnClickaway={false}
          showRowHover={true}
          stripedRows={false}>
          {filterJSX}
        </Mui.TableBody>
      </Mui.Table>);
            
    return (
      <div flex layout="row">
        <md-content flex color={Colors.white} >
          <Mui.Paper id="sheet">
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
                        defaultValue={this.state.what}
                        onChange= {this.handleSelectWhat}
                        hintText="Quoi ?"
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