"use strict";

var React = require('react');
var $ = require('jquery');

var MapView =  React.createFactory(require('./mapView.jsx'));

module.exports = React.createClass({
  getInitialState: function() {
    var availableCategories = [
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
      'wood']
    return {result: null, mode: 0, condition: 0, radius: 50, availableCategories: availableCategories, categories: [], searchCpt: 0};
  },
  componentDidMount: function() {
    var self = this;

    var where = React.findDOMNode(this.refs.where);
    google.maps.event.addDomListener(window, 'load', function() {
      if (where) {
        var autocomplete = new google.maps.places.Autocomplete(where, { types: ['geocode'] });
        google.maps.event.addListener(autocomplete, 'place_changed', function(){
          var place = autocomplete.getPlace();
          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }
          self.setState({geoloc: {lat: place.geometry.location.G, lon: place.geometry.location.K}, placeName: address})
        });
      }
    })
  },
  launchSearch: function(){
    var self = this;

    var options =  React.findDOMNode(this.refs.what).options;
    var categories = [];
    for(var i=0; i<options.length; ++i){
      if(options[i].selected == false) continue;
      var value = options[i].value;
      categories.push(value);
    }
    var data = {
      'placeName': this.state.placeName,
      'radius': this.state.radius,
      'categories': categories,
      'geoloc': this.state.geoloc
    };
    $.ajax({
      type: 'POST',
      url: '/search',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data) {
        var mode = self.state.mode;
        if(mode===0) mode = 1;
        self.setState({result: data, mode: mode, searchCpt: self.state.searchCpt+1});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  changeCondition: function(condition){
    this.setState({condition: condition});
  },
  render: function() {
    var self = this;

    var conditions = ["Neuf", "Bon état", "Réparable", "Irréparable"]; 
    var resultJSX = "";

    // Landing page tags
    var idFrame = "landingPage";
    var nameJSX = (<h1>6 Element</h1>);
    var mvpJSX = (<h2>Jetez encore plus mieux</h2>);
    
    var suffixLg = "-lg"; // Size on the search bar, Large on the Landing page, Normal on the results page
    

    // Condition (état) list items
    // !INFORMATION! Condition items are stored on 2 ways:
    // - as radio buttons in landing page search bar (preConditionJSX)
    // - as single item list in results page mini search bar (postConditionJSX)
    var preConditionJSX = "";
    var itemsJSX = conditions.map(function(condition, index){
      return (<label className="radio-inline"><input type="radio" name="optradio" checked={self.state.condition===index} onClick={self.changeCondition.bind(self,index)}/>{condition}</label>);
    });
    var postConditionJSX = (
      <div id="groupCondition" className="text-left">
        {itemsJSX}
      </div>);

    if(this.state.result){

      idFrame = "resultsPage";
      mvpJSX = "";
      resultJSX = (
        <div id="list" key={'list'+this.state.searchCpt.toString()} className="container">
          <br/>
          <MapView key={'map'+this.state.searchCpt.toString()} result={this.state.result}/>
        </div>);
      suffixLg = "";
      itemsJSX = conditions.map(function(condition, index){
        return (<li className={self.state.condition===index?"active":""}><a href="javascript:;" onClick={self.changeCondition.bind(self,index)}>{condition}</a></li>);
      });
      preConditionJSX = (
      <div className="btn-group dropdown" id="groupCondition">
        <button type="button" className="form-control dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <strong>État | {conditions[this.state.condition]}</strong> <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="groupCondition">
          {itemsJSX}
        </ul>
      </div>);
      postConditionJSX = "";
    }

    var selectJSX = this.state.availableCategories.map(function(category){
      return (<option key={category} value={category}>{category}</option>);
    });

    return(
      <div id={idFrame}>
        {nameJSX}
        {mvpJSX}
        <div id="searchBar" className="navbar-form navbar-inverse" role="search">
          <div className="form-group">
            <select className={"form-control input"+suffixLg}  id="what" ref="what">
              {selectJSX}
            </select>
            <input type="text" id="where" ref="where" className={"form-control input"+suffixLg} placeholder="Où ?" autoComplete="off"/>
            {preConditionJSX}
            <button id="btnSearch" className={"btn btn-primary navbar-btn btn"+suffixLg} onClick={this.launchSearch}>
              <a href="javascript:;" className="glyphicon glyphicon-search"></a>
            </button>
            {postConditionJSX}
            <br/>
          </div>
        </div>
        {resultJSX}
      </div>);
  }
});