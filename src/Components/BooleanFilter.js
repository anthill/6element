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
        var props = this.props;
        var state = this.state;
        
        return React.DOM.button({className: [props.className, (state.active ? 'active' : '')].join(' '),
            onClick: function(){
                props.onChange(!props.fav);
            }});
    }
});
