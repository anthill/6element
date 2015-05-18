'use strict';

var React = require('react');

var Panel =  React.createFactory(require('./Panel.js'));
var MapComponent =  React.createFactory(require('./MapComponent.js'));

/*
interface Application Props{
    recyclingCentersData: Map (recyclingCenter_id -> {recyclingCenter_infos}),
    predictions: Map (recyclingCenter_id -> {recyclingCenter_predictions})
    predict: function(Date()) -> new rendering with updated prediction,
    changeVersion: function(int) -> new rendering with actualized version
}
interface Application State{
    version: int,
    selectedRecyclingCenter: {},
    selectedDate: dateString,
    predictions: Map (recyclingCenter_id -> {recyclingCenter_predictions})
}
*/

var token = 'anthill.m68f42m4';


module.exports = React.createClass({

    getInitialState: function(){
        return {};
    },

    componentWillReceiveProps: function(nextProps){
        // console.log('APP nextProps', nextProps);

    },

    render: function() {

        var self = this;
        var props = this.props;
        var state = this.state;
        
        var panel = new Panel({
        });

        // build Map
        var map = new MapComponent({
            token: token
        });

        return React.DOM.div({id: 'app'},
            panel,
            map
        );

    }
});
