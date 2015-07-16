'use strict';


var React = require('react');
var RC = React.createFactory(require('./RC.js'));
/*

interface AppProps{
    rcs
}
interface AppState{
    displayedRC: id (integer)
}

*/


var App = React.createClass({
    displayName: 'App',
    
    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
        var rc = props.rcsFake.get(state.id);
        
        return React.DOM.div({});
    }
});

module.exports = App;

/*
onFavChange is giung to wite in userPrefn and update its status
props : rcList, displayedRCid, 
*/