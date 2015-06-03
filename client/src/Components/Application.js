'use strict';

var React = require('react');

var Panel =  React.createFactory(require('./Panel.js'));
var MapComponent =  React.createFactory(require('./MapComponent.js'));

/*

interface AffluenceHistory{
    date: Date
    measurement: number
}

interface RecyclingCenter{
    name: string,
    id: RecyclingCenterId,
    lon: number,
    lat: number,
    max: number,
    latest: number,
    details? : AffluenceHistory[]
}


interface ApplicationProps{
    mapBoxToken: string,
    mapId,
    mapCenter,
    recyclingCenters: RecyclingCenter[],
    getRecyclingCenterDetails: (RCId) => Promise<AffluenceHistory[]>
}

interface ApplicationState{
    selectedRecyclingCenter: RecyclingCenter
}
*/

module.exports = React.createClass({

    getInitialState: function(){
        return {
            selectedRecyclingCenter: this.props.selectedRecyclingCenter
        };
    },
    
    componentWillReceiveProps: function(newProps){
        this.setState({
            selectedRecyclingCenter: newProps.selectedRecyclingCenter
        });
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
        var panel = new Panel({
            recyclingCenter: state.selectedRecyclingCenter
        });

        // build Map
        var map = new MapComponent({
            mapBoxToken: props.mapBoxToken,
            mapId: props.mapId,
            mapCenter: props.mapCenter,
            recyclingCenters: props.recyclingCenters,
            selectedRecyclingCenter: state.selectedRecyclingCenter,
            onRecylcingCenterSelected: function(rc){
                if(rc.details){
                    self.setState({
                        selectedRecyclingCenter: rc
                    });    
                }
                else{
                    props.getRecyclingCenterDetails(rc);
                }
                
            }
        });

        return React.DOM.div({id: 'app'},
            panel,
            map
        );

    }
});
