'use strict';

var React = require('react');
    
/*
    props: {
        fav: boolean,
        className: String,
        onChange: (nextStat: boolean) => void
    }
*/

module.exports = React.createClass({
    getInitialState: function(){
        return { active: this.props.active };
    },


    render: function(){
        var state = this.state;
        var props = this.props;
        
        var self = this;
        
        return React.DOM.button({className: [props.className, (state.active ? 'active' : '')].join(' '),
            onClick: function(){
                props.onChange(!propS.fav);
            }});
    }
});