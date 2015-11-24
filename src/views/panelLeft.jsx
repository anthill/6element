"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var Preview  =  require('./preview.js');

var Colors = require('material-ui/lib/styles/colors');

module.exports = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
  },
  toggle: function(){
    this.refs.leftNav.toggle();
    this.setState({displayed: !this.state.displayed});
  },
  getInitialState: function() {
    return {displayed: true, maxLength: 20};
  },
  onClickPreview: function(object){
      this.props.onShowDetail(object);
  },
  onLoadMore: function(){
    var listFilters = this.props.filters
    .filter(function(filter){
        return filter.checked;
    })
    .map(function(filter){
      return filter.name;
    });
    var nbResults = this.props.result.objects.filter(function(place){
      return (listFilters.indexOf(place.file) !== -1);
    }).length;
    var nbPlaces = this.state.maxLength+20;
    this.setState({maxLength: nbPlaces});
    if(nbPlaces > nbResults){
    
      var parameters = this.props.parameters;
      parameters.nbPlaces = nbPlaces; 
      this.props.onSearch(this.props.parameters, null, 2, nbPlaces);
   }

  },
  render: function() {
       
    // *** HACK MENTION ***
    // Panel component embeded in the header of an empty LeftNav component

    var listFilters = this.props.filters
    .filter(function(filter){
        return filter.checked;
    })
    .map(function(filter){
      return filter.name;
    });
    var results = this.props.result.objects.filter(function(place){
      return (listFilters.indexOf(place.file) !== -1);
    });
    var nbResults = results.length;

   
    // Panel list
    var self = this;
    var resultJSX = "";
    if(nbResults === 0){
      resultJSX = (<div className="fixedHeader"><p>Il n&apos;y a <strong>aucun</strong> résultat pour votre recherche</p></div>);
    }
    else
    {
      var listJSX = results.slice(0, this.state.maxLength).map(function(object){
        return (
          <a href="javascript:;" className="noRef clickable" onClick={self.onClickPreview.bind(self,object)}>
            <Preview object={object} />
          </a>);
      });

      resultJSX = (
        <div>
          <div>
            {listJSX}
          </div>
          <div id="moreResults" className="clickable">
            <a href="javascript:;" className="noRef" onClick={self.onLoadMore}>
              <label className="clickable" ><Mui.FontIcon className="material-icons" color={Colors.grey600} >add_circle</Mui.FontIcon> Plus de résultats</label>
            </a>
          </div>
        </div>);
    }
    

    var menuItems = [];
    
    var style = {
      'top':'56px',
      'width':this.state.displayed?'100%':'10px',
      'maxWidth': '400px',
      'visibility':this.props.visibility,
      'overflow':'auto'
    }
   return (
      <Mui.LeftNav 
        ref="leftNav" 
        docked={true} 
        openRight={false} 
        menuItems={menuItems} 
        style={style}
        header={resultJSX} />);
  }
});