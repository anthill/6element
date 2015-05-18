'use strict';

var React = require('react');

var Panel =  React.createFactory(require('./Panel.js'));
var MapComponent =  React.createFactory(require('./MapComponent.js'));

/*
interface ApplicationProps{
    mapBoxToken: string,
    mapId,
    mapCenter
}
interface ApplicationState{
}
*/

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
            mapBoxToken: props.mapBoxToken,
            mapId: props.mapId,
            mapCenter: props.mapCenter
        });

        return React.DOM.div({id: 'app'},
            panel,
            map
        );

    }
});
