'use strict';

var React = require('react');
var LineChart = React.createFactory(require('./LineChart.js'));

/*
interface DetailProps{
    place: Place
}
*/

var Detail = React.createClass({

    getInitialState: function(){
        return {}
    },

    render: function() {
        //var self = this;
        var props = this.props;

        // console.log('detail props', props);
                
        return React.DOM.div({id: 'detail'}, 
            React.DOM.h2({}, props.place.name),
            new LineChart({ measurements: props.place.details })
        );
    }

});

module.exports = Detail;
