'use strict';

var React = require('react');
var LineChart = React.createFactory(require('./LineChart.js'));

/*

interface DetailProps{
    recyclingCenter: RecyclingCenter
}
interface DetailState{

}

*/


function dateLabel(d){
    var dateobj = new Date(d);

    var minutes = dateobj.getMinutes();

    return [
        dateobj.getHours(),
        'h',
        minutes <= 9 ? '0'+minutes : minutes
    ].join('');
}


var Detail = React.createClass({

	getInitialState: function(){
        return {}
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('detail props', props);
                
        return React.DOM.div({id: 'detail'}, 
        	React.DOM.h2({}, props.recyclingCenter.name),
	    	LineChart({
                labels: props.recyclingCenter.details.map(function(d){
                    return dateLabel(d.measurement_date);
                }),
                observed: props.recyclingCenter.details.map(function(d){
                    return d.measurement;
                }),
                metrics: {}
            })
        );
    }

});


module.exports = Detail;
