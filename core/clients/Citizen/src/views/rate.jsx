"use strict";

var React = require('react');

module.exports = React.createClass({
  render: function() {
    var starsJSX = [];
    for(var i=1; i<=this.props.rate; ++i)
      starsJSX.push((<span className="glyphicon glyphicon-star star"></span>));
    for(var i=this.props.rate+1; i<=5; ++i)
      starsJSX.push((<span className="glyphicon glyphicon-star-empty no-star"></span>));

    return (
      <label>{starsJSX}</label>
    );
  }
});