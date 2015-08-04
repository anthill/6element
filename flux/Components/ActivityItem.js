"use strict";

var React = require('react');

var K = require('../Constants/constants.js');


var adTypeClasses = {};
adTypeClasses[K.adType.GIVE] = 'give';
adTypeClasses[K.adType.NEED] = 'need';



module.exports = React.createClass({

    displayName: 'ActivityItem',

    getInitialState: function(){
        return {
            openPanel: undefined
        };
    },
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
        return React.DOM.li({className: adTypeClasses[props.ad.type]}, [
            React.DOM.header({}, [
                React.DOM.span({className: 'private'}, props.ad.private ? 'private' : ''),
                React.DOM.h1({
                    onClick: function(){
                        self.setState({
                            openPanel: state.openPanel === 'ad' ? undefined : 'ad'
                        });
                    }
                }, props.ad.title),
                React.DOM.span({
                    onClick: function(){
                        self.setState({
                            openPanel: state.openPanel === 'proposals' ? undefined : 'proposals'
                        });
                    }
                }, 'Proposals ('+props.proposals.length+')'),
                React.DOM.span({title: 'delete'}, 'X')
            ]),
            state.openPanel === 'ad' ?
                React.DOM.section({}, JSON.stringify(props.ad)) :
                (state.openPanel === 'proposals' ? 
                    React.DOM.section({}, JSON.stringify(props.proposals)) :
                    undefined)
        ]);
    }
});
