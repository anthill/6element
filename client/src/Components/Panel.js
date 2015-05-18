'use strict';

var React = require('react');

/*
interface Panel Props{
    version: string,
    selectedRecyclingCenter: {recyclingCenter_infos},
    selectedDate: Date(),
    dateEntriesMap: Map (date -> value),
    predictions: {recyclingCenter_predictions},
    onDateSelection: function -> void,
    onVersionSelection: function -> change version and/or predict
}
interface Panel State{
    selectedTab: integer
}
*/

var Panel = React.createClass({

    getInitialState: function(){
        return {
            selectedTab: 0
        };
    },

    render: function() {

        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('PANEL state', this.state);
        // console.log('PANEL props', props);
        // console.log('PANEL props.selectedRecyclingCenter', props.selectedRecyclingCenter);

        // build tabs
        /*var tabs = new Tabs({
            tabNames: ['Predictions'],
            selectedTab: state.selectedTab,
            onTabChange: function(tabNumber){
                // console.log('tabnumber', tabNumber);
                self.setState({
                    selectedTab: tabNumber
                });
            }
        });*/

        // else {
        //     tabContent = new AnalyseContent({
        //         recyclingCenterInfos: props.selectedRecyclingCenter
        //     });
        // }

        return React.DOM.div({id: 'panel'}, '');
    }
});

module.exports = Panel;
