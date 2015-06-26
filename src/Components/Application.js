'use strict';

var React = require('react');

/*

interface AppProps{
    rcFake: {}
}
interface AppState{
    selectedRC: int
}

*/

var App = React.createClass({
    displayName: 'App',

    /*getInitialState: function(){
        return {
            selectedRC: undefined
        };
    },*/
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('APP props', props);
        // console.log('APP state', state);

        
        /*var rcContent = new RcContent({
            selectedRC : props.rcs[state.selectedRC]
        });*/
        var lis = [];
        
        for(var field in props.rcFake)
        {
            var li = React.DOM.li({}, 
                React.DOM.div({}, field),
                React.DOM.div({}, props.rcFake[field])
            );
            
            console.log('li', li);
            
            lis.push(li);
        }
        
        return React.DOM.div({id: 'myApp'},
            React.DOM.h1({}, props.rcFake.name),
            React.DOM.div({}, lis)
        )
    }
});

module.exports = App;
