'use strict';

var React = require('react');
var LineChart = React.createFactory(require('./LineChart.js'));

/*
interface DetailProps{
    recyclingCenter: RecyclingCenter
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
                
        return React.DOM.div(
            {id: 'detail'}, 
            React.DOM.h2({}, props.recyclingCenter.name),
            new LineChart({ measurements: props.recyclingCenter.details })
        );
    }

});

module.exports = Detail;
