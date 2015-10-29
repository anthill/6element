"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var Preview  =  require('./preview.jsx');

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
    return {displayed: true};
  },
  onClickPreview: function(object){
      this.props.onShowDetail(object);
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
   
    // Panel list
    var self = this;
    var listJSX = results.map(function(object){
      return (
        <a href="javascript:;" className="noRef clickable" onClick={self.onClickPreview.bind(self,object)}>
          <Preview object={object} />
        </a>
      );
    });

    var menuItems = [];
    
    var style = {
      'top':'56px',
      'width':this.state.displayed?'100%':'10px',
      'maxWidth': '400px',
      'visibility':this.props.visibility,
      'overflow':'auto',
    }
   return (
      <Mui.LeftNav 
        ref="leftNav" 
        className="panel"
        docked={true} 
        openRight={false} 
        menuItems={menuItems} 
        style={style}
        header={listJSX} />);
  }
});