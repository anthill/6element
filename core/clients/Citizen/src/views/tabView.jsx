"use strict";

var React = require('react');

module.exports = React.createClass({
  changeView: function(view){
    this.props.changeView(view);
  },
  render: function() {
    return (
      <ul className="pagination">
        <li className={(this.props.view==0)?"active":""}><a href="javascript:;" onClick={this.changeView.bind(this,0)}><i className="glyphicon glyphicon-list-alt"></i></a></li>
        <li className={(this.props.view==1)?"active":""}><a href="javascript:;" onClick={this.changeView.bind(this,1)}><i className="glyphicon glyphicon-pushpin"></i></a></li>
      </ul>
    );
  }
});