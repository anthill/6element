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
    getRecyclingCenterDetails: (RCId) => Promise<AffluenceHistory[]>,
    updatingID: int
}

interface ApplicationState{
    selectedRCMap: Map ( id => RecyclingCenter )
}
*/

module.exports = React.createClass({

    getInitialState: function(){
        return {};
    },
    
    componentWillReceiveProps: function(newProps){

        this.setState({
            selectedRCMap: newProps.selectedRCMap
        });
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('APP', state.selectedRCMap);
        
        var panel = new Panel({
            recyclingCenterMap: state.selectedRCMap,
        });



        // build Map
        var map = new MapComponent({
            mapBoxToken: props.mapBoxToken,
            mapId: props.mapId,
            mapCenter: props.mapCenter,
            recyclingCenterMap: props.recyclingCenterMap,
            selectedRCMap: state.selectedRCMap,
            updatingID: props.updatingID,
            onRecyclingCenterSelected: function(rc){
                if(rc.details){
                    console.log('1');
                    if (state.selectedRCMap && state.selectedRCMap.has(rc.id)){
                        state.selectedRCMap.delete(rc.id);
                        console.log('2');
                        self.setState({
                            selectedRCMap: state.selectedRCMap
                        }); 
                    } else {
                        console.log('3');
                        state.selectedRCMap.set(rc.id, rc);

                        self.setState({
                            selectedRCMap: state.selectedRCMap
                        });
                    }
                }
                else{
                    console.log('6');
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
