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
        radius: 50,
        categories: ['All'],
        placeName: '',
        geoloc: [44.8404507,-0.5704909],
        square: {}, 
        objects: []
    }
    return {what: 'All', placeName: '', radius: iniResult.radius, tab: 0, result: iniResult, files: [], cpt: 0, detailedObject: null};
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
        self.setState({geoloc: {lat: place.geometry.location.H, lon: place.geometry.location.L}, placeName: address})
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
    var self = this;
    this.refs.dialog.dismiss();

    var data = {
      'placeName': this.state.placeName,
      'radius': this.state.radius,
      'categories': [this.state.what],
      'geoloc': this.state.geoloc
    };
    requestData(data)
    .then(function(result){
      var temp = [];
      var files = [];
      console.log(result);
      result.objects.forEach(function(object){
        if(temp.indexOf(object.file) ===-1){
          temp.push(object.file);       
          files.push({
            name: object.file.replace('.json', ''),
            color: object.color,
            checked: true
          }); 
        }
      });
      self.setState({result: result, files: files, cpt: self.state.cpt+1});
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
    this.setState({files: files, cpt: this.state.cpt+1});
  },
  onShowDetail: function(object){
    this.setState({detailedObject: object})
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
      { text: 'Valider', onTouchTap: this.onDialogSubmit, ref: 'submit' }
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
      resultJSX = (<MapView key={'map'+this.state.cpt.toString()} result={result} onShowDetail={this.onShowDetail} />);
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
        fixedHeader={true}
        fixedFooter={false}
        selectable={true}
        multiSelectable={true}
        onRowSelection={this.onSelectFilter}>
        <Mui.TableHeader enableSelectAll={true}>
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
                <Mui.IconButton tooltip="Filtrer par source" onTouchTap={this.handleLeftNav} disabled={this.state.detailedObject!==null}><Mui.FontIcon className="material-icons" color={Colors.pink400} >filter_list</Mui.FontIcon></Mui.IconButton>
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
              openImmediately={this.state.cpt===0}
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