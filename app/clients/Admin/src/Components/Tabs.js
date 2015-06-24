'use strict';

var React = require('react');

/*
interface Tabs Props{
    tabNames: String[],
    selectedTab : integer,
    onTabChange: (newTabIndex: number) => void
}
interface Tabs State{
}
*/


var Tabs = React.createClass({
    displayName: 'Tabs',

    render: function() {

        var self = this;
        var state = this.state;
        var props = this.props;

        // console.log('TABS props', props);

        var tabList = props.tabNames.map(function(tabName, index){
            var style = '';

            if (props.selectedTab === index){
                style = 'selected';
            }

            return React.DOM.li({
                className : style,
                onClick: function(){
                    console.log('index', index);
                    props.onTabChange(index);
                }
            }, tabName);
        });

        

        return React.DOM.ul({className : "tabs"}, 
            tabList
        );
    }
});

module.exports = Tabs;