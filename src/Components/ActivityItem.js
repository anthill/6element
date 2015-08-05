"use strict";

var React = require('react');

// COMPONENTS

// ACTIONS

// STORES
var AdStore = require('../Stores/adStore.js');

// UTILS
var K = require('../Constants/constants.js');
var adTypes = K.adTypes;

/*

interface ActivityItemProps{
    id: integer,
    myAd: integer,
    links: [
        {
            userId: integer,
            adId: integer,
            state: string
        }
    ],
    direction: string,
    state: string
}
interface ActivityItemState{
    openPanel: boolean
}

*/

function getStateFromStores(id, otherIds) {

    if (otherIds){
        var otherAds = otherIds.map(function(otherId){
            return AdStore.get(otherId);
        });
    }

    var myAd = AdStore.get(id);

    return {
        myAd: myAd,
        otherAds: otherAds ? otherAds : undefined
    };
}

module.exports = React.createClass({

    displayName: 'ActivityItem',

    getInitialState: function(){
        var stateFromStores = getStateFromStores(this.props.myAdId);

        return Object.assign(stateFromStores, {
            openPanel: false
        });
    },
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('AITEM props', props);
        console.log('AITEM state', state);

        var header = React.DOM.header({},
            // React.DOM.span({className: 'private'}, props.ad.private ? 'private' : ''),
            React.DOM.h1({},
                state.myAd.content.title
            ),
            React.DOM.div({
                    onClick: function(){
                        console.log('View myAd');
                    }
                },
                'View'
            ),
            React.DOM.span({
                    onClick: function(){
                        self.setState({
                            openPanel: !state.openPanel
                        });
                    }
                },
                'Proposals (' + props.links.length + ')'
            ),
            React.DOM.span({title: 'delete'}, 'X')
        );
        
        return React.DOM.li({className: adTypes[props.direction]},
            header,
            state.openPanel ?
                React.DOM.section({}, JSON.stringify(props.links))
                : undefined
        );
    }
});
