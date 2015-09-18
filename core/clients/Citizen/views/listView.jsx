"use strict";

var React = require('react');
var DetailView  =  require('./detailView.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {tab: 0, sort: 1, filterDisplayed: false};
  },
  select: function(index){
    this.props.select(index);
  },
  sort: function(sort){
    this.setState({sort: sort, tab: 0});
  },
  displayFilter: function(display){
    this.setState({filterDisplayed: display});
  },
  postAdvert: function(){
    throw "TODO Bro!";
  },
  expand: function(index){
    this.props.expand(index);
  },
  render: function() {

    if(this.props.result.length===0) return "";
    var self = this;

    // Sort button
    var labelsSort = ["Pertinence","Distance"];
    var navTypeSortJSX = (
      <div>
        <select className="form-control input-sm">
          <option>pertinence</option>
          <option>distance</option> 
        </select>
      </div>
    );

    var  navSortJSX = (
      <div className="btn-group dropdown" id="groupSort">
        <button type="button" className="form-control dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <strong>Tri | {labelsSort[this.state.sort]}</strong> <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="groupSort">
          <li className={this.state.sort===0?"active":""}><a href="javascript:;" onClick={this.sort.bind(this,0)}>par Pertinence</a></li>
          <li className={this.state.sort===1?"active":""}><a href="javascript:;" onClick={this.sort.bind(this,1)}>par Distance</a></li>
        </ul>
      </div>
    );
   
    var listJSX = this.props.result.objects
    .sort(function(o1, o2){
      if(self.state.sort === 0)
        return (o1.rate-o2.rate);
      else
        return (o1.distance-o2.distance);
    })
    .slice(0,30)
    .map(function(object, index){

      // DETAIL
      var isDetailed = self.props.detail !== null && self.props.detail === index;
      var detailJSX = "";
      if(isDetailed){
        detailJSX  = (  
          <div>
            <a href="javascript:;">
              <span onClick={self.expand.bind(self, null)}>
                <i className="glyphicon glyphicon-triangle-top"></i>
              </span>
            </a>
          </div>);
      } else {
        detailJSX = (
          <div className="text-left">
            <a href="javascript:;">
              <span onClick={self.expand.bind(self, index)}>
                <i className="glyphicon glyphicon-plus-sign"></i> d&apos;infos
              </span>
            </a>
          </div>);
      }

      return (
        <div className="panel panel-default">
          <div className="panel-body">
            <DetailView object={object} isDetailed={isDetailed} select={self.select} index={index} /> 
            {detailJSX}
          </div>
        </div>);
    });
    
    return (
      <div className="col-lg-6">
        <div className="clearfix">
          <div className="pull-left">{navSortJSX}</div>
        </div>
        <div id="listView">
          {listJSX}
        </div>
        <div id="postAdvert" className="navbar-form navbar-inverse" role="search">
          <div className="form-group">
            <label>Vous ne trouvez pas ? Déposez une annonce </label> 
            <button className="btn btn-primary" onClick={this.postAdvert}><a href="javascript:;" className="glyphicon glyphicon-pencil"></a></button>
          </div>
        </div>
      </div>                                              
    );
  }
});