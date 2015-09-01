'use strict';

var React = require("react");

/*
interface LineChart Props{
    measurements: [{id: 18, measurement: 18, measurement_date: "2015-07-09T12:45:53.629Z"}],
    day: string
}
interface LineChart State{
}
*/

var CHART_DIV_REF = 'tsNumber';

// build empty values => enable empty chart
var defaultLabels = [];
var defaultObserved = [];

for (var i = 0; i < 20; i++){
    if (i % 3 === 0)
        defaultLabels.push(6 + Math.round(i/3));
    else
        defaultLabels.push('');

    defaultObserved.push(Math.random()*4);
}

var LineChart = React.createClass({
    componentDidMount: function(){
        this.update();
    },
    componentDidUpdate: function(){
        this.update();
    },

    update: function() {
        var props = this.props;
    
        var data = props.measurements.map(function(x){
            var date = new Date(x.measurement_date);
            return [date, x.measurement, x.realMeasurement];
        });

        var beginDay;
        var endDay;

        if (props.day) {
            beginDay = new Date(props.day); // The day
            endDay = new Date(beginDay.getTime() + (1000 * 60 * 60 * 24 * 2)); // +48h
        } else {
            endDay = new Date(); // Now
            beginDay = new Date(endDay - (1000 * 60 * 60 * 24 * 2)); // -48h
        }

        // this part is super awkward, not very React-y.
        var chart = new Dygraph(
            React.findDOMNode(this.refs[CHART_DIV_REF]),
            data,
            {
                labels: [ "time", "Traces wifi", "real datas" ],
                legend: "onmouseover",
                strokeWidth: 2,
                dateWindow: [beginDay, endDay]
            }
        );
        console.log(chart)
    },

	render: function(){
        return React.DOM.div({className: 'line-chart'},
            React.DOM.div({ref: CHART_DIV_REF, className: 'chart'})
        );
	}

});


module.exports = LineChart;
