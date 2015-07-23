'use strict';

var React = require('react');

/*

interface SelectorProps{
    antIDSet: Set(antID),
    currentID: int,
    onClick: function(),
    onChange: function()
}
interface SelectorState{
    isOpen: bool
}

*/

var Selector = React.createClass({
    displayName: 'Selector',

    getInitialState: function(){
        return {
            isOpen: false,
        };
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('Selector props', props);
        console.log('Selector state', state);

        var listID = undefined;

        console.log("isOpen", state.isOpen);
        

        if (state.isOpen) {
            console.log("Dans isOpen");
            var lis = [];
            props.antIDset.forEach(function (antID) {
                lis.push(React.DOM.li({}, antID));
            });

            listID = React.DOM.ul({}, lis);
        }

        console.log("listID", listID);

        return React.DOM.div({className: 'selector',
            onClick: function(){
                    console.log('onclick currentID', props.currentID);
                    self.setState({
                        isOpen: !state.isOpen
                    });
                }
            },
            React.DOM.div({className: 'currentID'},
                props.currentID,
                listID
            )
        );
    }
});

module.exports = Selector;
