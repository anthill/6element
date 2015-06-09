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
    recyclingCenterMap: Map (RCId => RecyclingCenter),
    getRecyclingCenterDetails: (RCId) => Promise<AffluenceHistory[]>
}

interface ApplicationState{
    selectedID: RecyclingCenter Id
}
*/

module.exports = React.createClass({

    getInitialState: function(){
        return {
            selectedID: this.props.selectedID
        };
    },
    
    componentWillReceiveProps: function(newProps){
        this.setState({
            selectedID: newProps.selectedID
        });
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
        var panel = new Panel({
            recyclingCenter: props.recyclingCenterMap ? props.recyclingCenterMap.get(state.selectedID) : undefined
        });

        // build Map
        var map = new MapComponent({
            mapBoxToken: props.mapBoxToken,
            mapId: props.mapId,
            mapCenter: props.mapCenter,
            recyclingCenterMap: props.recyclingCenterMap,
            selectedID: state.selectedID,
            onRecyclingCenterSelected: function(rc){
                if(rc.details){

                    if (self.state.selectedID === rc.id){
                        self.setState({
                            selectedID: undefined
                        }); 
                    } else {
                        self.setState({
                            selectedID: rc.id
                        });    
                    }
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
