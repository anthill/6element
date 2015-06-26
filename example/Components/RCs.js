'use strict';

var React = require('react');

/*
interface RCs Props{
    RcNames: String[],
    selectedRc : integer,
    onRcChange: (newRcsIndex: number) => void
}
interface RCs State{
}
*/


var RCs = React.createClass({
    displayName: 'RCs',

    render: function() {

        var self = this;
        var state = this.state;
        var props = this.props;

        // console.log('Rc props', props);

        var rcList = props.rcNames.map(function(name, index){
            var style = '';

            if (props.selectedRC === index){
                style = 'selected';
            }

            return React.DOM.li({
                className : style,
                onClick: function(){
                    console.log('index', index);
                    props.onRCChange(index);
                }
            }, name);
        });

        return React.DOM.ul({className : "rcs"}, 
            rcList
        );
    }
});

module.exports = RCs;