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

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('Selector props', props);
        console.log('Selector state', state);


        // var classes = [
        //     'selector',
        //     //isSelected ? 'selected' : '',
        // ];
        var list = undefined;

        if (true) {
            var lis = [];
            props.antIDset.forEach(function (antID) {
                lis.push(React.DOM.li({}, antID));
            });

            list == React.DOM.ul({}, lis);
        }

        console.log("lis", lis);

        return React.DOM.div({className: 'selector'},
            React.DOM.div({className: 'currentID'}, props.currentID),
            list
        );
    }
});

module.exports = Selector;
