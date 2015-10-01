"use strict";

var React = require('react');
var L = require('leaflet');
var MapView = require('./mapView.jsx');

var MaterialUi = require('material-ui');
var AppBar = require('material-ui/lib/app-bar');
var LeftNav = require('material-ui/lib/left-nav');
var Lists = require('material-ui/lib/lists');
var Menu = require('material-ui/lib/menu');
var Menus = require('material-ui/lib/menus');
var Dialog = require('material-ui/lib/dialog');
var TextField = require('material-ui/lib/text-field');
var SelectField = require('material-ui/lib/select-field');
var Table = require('material-ui/lib/table');
var Tab = require('material-ui/lib/tabs');
var Colors = require('material-ui/lib/styles/colors');
var $ = require('jquery');
var mapsApi = require( 'google-maps-api' )( 'AIzaSyCLuhubHWNbDgBhmj61OUo07L-zjHsVkKw' , ['places']);
var requestData = require('./../js/requestData.js');

//require('material-ui/lib/svg-icon');
var NavigationExpandMore = require('material-ui/lib/svg-icons/navigation/expand-more');
var ActionSearch = require('material-ui/lib/svg-icons/action/search');
var MoreVert = require('material-ui/lib/svg-icons/navigation/more-vert');
require('material-ui/lib/toolbar');

var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton = require('material-ui/lib/flat-button');
var DropDownMenu = require('material-ui/lib/drop-down-menu');
var RaisedButton = require('material-ui/lib/raised-button');

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
    return {what: 'All', placeName: '', radius: iniResult.radius, tab: 0, result: iniResult, files: [], cpt: 0};
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
  handleChangeTab: function(value,e,tab){
    this.setState({tab: value})
  },
  getMapInfos: function(map){
    this.loadSelection(map, null, this.state.files);
  },
  render: function() {

    var whatOptions = availableCategories.map(function(category, index){
      return { payload: index, text: category };
    });
    
    var menuItems = [];

    //Standard Actions
    let standardActions = [
      { text: 'Valider', onTouchTap: this.onDialogSubmit, ref: 'submit' },
      { text: 'Annuler' }
    ];

    var result = this.state.result;
    var resultJSX = "";
    if(result){
      resultJSX = (<MapView key={'map'+this.state.cpt.toString()} result={result}/>);
      menuItems = this.state.files.map(function(file){
        return { text: file.name, selected: true };
      });
      //console.log(menuItems);
    }
    return (
      <div>
        <AppBar
          title="6element"
          zDepth={2}
          showMenuIconButton={false}
          iconElementRight={<IconButton><MoreVert/></IconButton>} 
          onLeftIconButtonTouchTap={this.handleLeftNav} >
        </AppBar>
        <Tab.Tabs
          zDepth={2}
          onChange={this.handleChangeTab}>
          <Tab.Tab value={0} label="Afficher par Carte" />
          <Tab.Tab value={1} label="Afficher par Liste" />
        </Tab.Tabs>
        {resultJSX}
        <LeftNav ref="leftNav" docked={false} menuItems={menuItems}>
        </LeftNav>
        <Dialog
          ref="dialog"
          title="6element"
          actions={standardActions}
          actionFocus="submit"
          modal={true}
          onShow={this.onShowDialog}
          openImmediately={true}
          autoDetectWindowHeight={true} 
          autoScrollBodyContent={true}
          contentStyle={{width: '420px'}}>
          <div>
            <table width="100%">
              <tr>
                <td><FontIcon className="material-icons" color={Colors.grey600} >description</FontIcon></td>
                <td>
                  <SelectField
                    ref="whatField"
                    defaultValue={this.state.what}
                    onChange= {this.handleSelectWhat}
                    hintText="Quoi ?"
                    fullWidth={true}
                    menuItems={whatOptions} />
                </td>
              </tr>
              <tr>
                <td><FontIcon className="material-icons" color={Colors.grey600} >room</FontIcon></td>
                <td>
                  <TextField
                    defaultValue={this.state.placeName}
                    ref="whereField" 
                    fullWidth={true}/>
                </td>  
              </tr>
            </table>
          </div>
        </Dialog>
      </div>
    );
  }
});


/*

    <Menu.IconMenu iconButtonElement={MoreVert}>
      <Menu.MenuItem primaryText="Refresh" />
      <Menu.MenuItem primaryText="Send feedback" />
      <Menu.MenuItem primaryText="Settings" />
      <Menu.MenuItem primaryText="Help" />
      <Menu.MenuItem primaryText="Sign out" />
    </Menu.IconMenu>
        <Lists.List>
          <Lists.ListItem primaryText="Inbox" leftIcon={<ActionSearch />} />
          <Lists.ListItem primaryText="Starred" leftIcon={<ActionSearch />} />
          <Lists.ListItem primaryText="Sent mail" leftIcon={<ActionSearch />} />
          <Lists.ListItem primaryText="Drafts" leftIcon={<ActionSearch />} />
          <Lists.ListItem primaryText="Inbox" leftIcon={<ActionSearch />} />
        </Lists.List>

var iconsCheck = ["glyphicon-unchecked", "glyphicon-check"];
    var filesJSX = this.state.files.map(function(file, index){
      var style = { 
        'color': file.color,
      };
      return (
        <li key={'file'+index.toString()}>
          <a href="javascript:;">
            <span> 
              <i className={"legend-name clickable glyphicon "+iconsCheck[(file.checked?1:0)]} onClick={self.selectFile.bind(self, index)} > </i> 
              <i className={"legend glyphicon glyphicon-stop"} style={style}> </i> 
              {file.name}
            </span>
          </a>
        </li>
      );
    });

    selectFile: function(index){
    var files = this.state.files;
    files[index].checked = !files[index].checked;
    this.loadSelection(this.state.map, null, files);
  },
  

  { type: Menu.MenuItem.Types.SUBHEADER, text: 'Recherche' },
      { route: 'get-started', text: 'Get Started' },
      { route: 'customization', text: 'Customization' },
      { route: 'components', text: 'Components' },
      { type: Menu.MenuItem.Types.SUBHEADER, text: 'Sources' },
      {
         type: Menu.MenuItem.Types.LINK,
         payload: 'https://github.com/callemall/material-ui',
         text: 'GitHub'
      },
      {
         text: 'Disabled',
         disabled: true
      },
      {
         type: Menu.MenuItem.Types.LINK,
         payload: 'https://www.google.com',
         text: 'Disabled Link',
         disabled: true
      },
*/