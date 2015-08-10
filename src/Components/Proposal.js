"use strict";

var React = require('react');

/*

interface ProposalProps{
    proposal: Proposal,
    changeStatus: function
}
interface ProposalState{
}

*/

module.exports = React.createClass({

    displayName: 'Proposal',

    getInitialState: function(){
        return {};
    },
    
    render: function() {
        //var self = this;
        var props = this.props;
        //var state = this.state;
        
        return React.DOM.div({
                className: 'proposal',
                onClick: function(){
                    props.changeStatus('NEW PROPOSAL STATUS');
                }
            },
            props.proposal.ad.content.title,
            props.proposal.status,
            props.proposal.ad.creator
        );
            
    }
});
