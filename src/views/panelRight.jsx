"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;

var Colors = require('material-ui/lib/styles/colors');

module.exports = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
  },
  toggle: function(){
    this.refs.rightNav.toggle();
  },
  render: function() {
       
    // *** HACK MENTION ***
    // Panel component embeded in the header of an empty LeftNav component

    // Panel list
    var filterJSX = this.props.filters.map(function(filter, id){
      return (
        <Mui.TableRow key={'filter'+id.toString()} selected={filter.checked} style={{width: "100%"}}>
          <Mui.TableRowColumn style={{padding: "10px"}}>{filter.name}</Mui.TableRowColumn>
          <Mui.TableRowColumn style={{maxWidth: "24px", padding: "0"}}>
            <Mui.FontIcon className="material-icons" color={filter.color}>lens</Mui.FontIcon>
          </Mui.TableRowColumn>
        </Mui.TableRow>);
    });

    var menuItems = [];
    var panelRightJSX = (
      <Mui.Table 
        fixedHeader={false}
        fixedFooter={false}
        selectable={true}
        multiSelectable={true}
        onRowSelection={this.props.onSelectFilter}
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
      <Mui.LeftNav 
        ref="rightNav" 
        docked={false} 
        openRight={true} 
        menuItems={menuItems} 
        header={panelRightJSX} />);
  }
});