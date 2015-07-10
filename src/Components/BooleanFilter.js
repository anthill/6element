

'use strict';

var React = require('react');
    
/*
    props: {
        active: boolean,
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
                var nextState = !state.active;
                self.setState({active: nextState});
                props.onChange(nextState);
            }});
                                
        
        
/*        return React.DOM.li({className: [props.className, (state.active ? 'active' : '')].join(' ')}, 
            React.DOM.button({
                onClick: function(){
                    var nextState = !state.active;
                    self.setState({active: nextState});
                    props.onChange(nextState);
                }
            }, props.label));*/
    }
});