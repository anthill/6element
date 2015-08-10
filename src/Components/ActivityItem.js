"use strict";

var React = require('react');

// COMPONENTS
var Proposal = React.createFactory(require('./Proposal.js'));

// ACTIONS
var trocActions = require('../Actions/trocActions.js');

// STORES

// UTILS
var directions = require('../Constants/directions.js');

var adTypeClasses = {};
adTypeClasses[directions.GIVE] = 'give';
adTypeClasses[directions.NEED] = 'need';


/*

interface ActivityItemProps{
    id: integer,
    myAd: Ad,
    proposalMap: Map(id => [
        {
            ad: Ad,
            state: string
        }
    ]),
    direction: string,
    status: string
}
interface ActivityItemState{
    openPanel: boolean
}

*/

module.exports = React.createClass({

    displayName: 'ActivityItem',

    getInitialState: function(){
        return {
            openPanel: false
        };
    },

    changeTrocStatus: function(status){
        trocActions.changeTrocStatus(this.props.id, status);
    },

    changeProposalStatus: function(proposalId){
        var self = this;

        var changeStatus = function(status){
            trocActions.changeProposalStatus(self.props.id, proposalId, status);
        };

        return changeStatus;
    },

    togglePrivacyStatus: function(){
        trocActions.togglePrivacyStatus(this.props.id);
    },

    removeTroc: function(){
        trocActions.removeTroc(this.props.id);
    },
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        var header = React.DOM.header({},
            React.DOM.span({
                    className: 'private',
                    onClick: function(){
                        self.togglePrivacyStatus();
                    }
                },
                props.myAd.isPrivate ? 'P' : ''
            ),
            React.DOM.h1({},
                props.myAd.content.title
            ),
            React.DOM.div({
                    onClick: function(){
                        self.changeTrocStatus('NEW TROC STATUS');
                    }
                },
                props.status
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
                'Proposals (' + props.proposalMap.size + ')'
            ),
            React.DOM.span({
                title: 'delete',
                onClick: this.removeTroc
            }, 'X')
        );

        if (state.openPanel){
            var proposalAds = [];
            props.proposalMap.forEach(function(proposal, index){
                proposalAds.push(new Proposal({
                    proposal: proposal,
                    changeStatus: function(newState){
                        var myFunc = self.changeProposalStatus(index);
                        myFunc(newState);
                    },
                    key: index
                }));
            });
        }
        
        return React.DOM.li({className: adTypeClasses[props.direction]},
            header,
            state.openPanel ?
                React.DOM.section({}, proposalAds)
                : undefined
        );
    }
});
