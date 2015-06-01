'use strict';

var React = require('react');

var Panel =  React.createFactory(require('./Panel.js'));
var MapComponent =  React.createFactory(require('./MapComponent.js'));

/*

interface AffluenceHistory{
    
}

interface RecyclingCenter{
    name: string,
    id: RecyclingCenterId,
    lon: number,
    lat: number,
    max: number,
    latest: number
}


interface ApplicationProps{
    mapBoxToken: string,
    mapId,
    mapCenter,
    recyclingCenters: RecyclingCenter[]
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
            mapCenter: props.mapCenter,
            recyclingCenters: props.recyclingCenters
        });

        return React.DOM.div({id: 'app'},
            panel,
            map
        );

    }
});
