'use strict';

var React = require('react');
var RCs = React.createFactory(require('./RCs.js'));
var RcContent = React.createFactory(require('./RcContent.js'));


/*

interface AppProps{
    rcs: []
}
interface AppState{
    selectedRC: int
}

*/

var App = React.createClass({
    displayName: 'App',

    getInitialState: function(){
        return {
            selectedRC: 0
        };
    },

    render: function() {
        var self = this;
        var props = this.props;
        //props.rcs = ma liste
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);
        
        var rcNames = props.rcs.map(function(rc){
            return rc.name;
        });

        var rcList = new RCs({
            rcNames: rcNames,
            selectedRC: state.selectedRC,
            onRCChange: function(index){
                self.setState(Object.assign(self.state, {
                    selectedRC: index
                }));
            }
        });
        
        var rcContent = new RcContent({
            selectedRC : props.rcs[state.selectedRC]
        });
        
        return React.DOM.div({id: 'myApp'},
            rcList,
            rcContent
        )
    }
});

module.exports = App;
