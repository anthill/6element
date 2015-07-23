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

module.exports = React.createClass({
    displayName: 'App',
    
    render: function() {
        //var self = this;
        var props = this.props;
        
        var rc = props.rcs.get(0);
        
        var rcSelected = new RC({rc: rc});
        
        return React.DOM.div({}, rcSelected);
    }
});
