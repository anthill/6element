'use strict';

var React = require('react');
var LineChart = React.createFactory(require('./LineChart.js'));

/*

interface DetailProps{
    place: Place
}
interface DetailState{

}

*/


var Detail = React.createClass({

	getInitialState: function(){
        return {}
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('detail props', props);
                
        return React.DOM.div({id: 'detail'}, 
        	React.DOM.h2({}, props.place.name),
	    	LineChart({ measurements: props.place.details })
        );
    }

});


module.exports = Detail;
