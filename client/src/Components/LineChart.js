'use strict';

var React = require("react");
var ReactChartLine = require("react-chartjs").Line;

/*
interface LineChart Props{
    labels: [],
    metrics: {},
    observed: []
}
interface LineChart State{
}
*/

// build empty values => enable empty chart
var defaultLabels = [];
var defaultObserved = [];
var defaultPredicted = [];
for (var i = 0; i < 20; i++){
    if (i % 3 === 0)
        defaultLabels.push(6 + Math.round(i/3));
    else
        defaultLabels.push('');

    defaultObserved.push(Math.random()*4);
}


// setting up line chart data => could be better, I KNOW !
var defaultData = {
    labels: defaultLabels,
    datasets: [
        {
            label: "Observés",
            fillColor: "rgba(0,0,0,0.2)",
            strokeColor: "rgba(0,0,0,1)",
            pointColor: "rgba(0,0,0,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(0,0,0,1)",
            data: defaultObserved
        }
    ]
};

var LineChart = React.createClass({

	render: function(){

		var props = this.props;
        console.log('LINECHART props', props);

        var data = defaultData;
        
        // fill chart data
        data.labels = props.labels.map(function(label, index){return index % 4 ? "" : label});

        data.datasets[0].data = props.observed;

        // display metrics
        var sumLegend = new React.DOM.div(
            {
                className: 'metrics table-layout'
            },
            React.DOM.div({},
                "",
                React.DOM.div({className: 'obs'}, "Observed")
            ),
            React.DOM.div({},
                "Sum",
                React.DOM.div({className: 'obs'}, Math.round(props.metrics.obsSum))
            ),
            React.DOM.div({},
                "Mean",
                React.DOM.div({className: 'obs'}, Math.round(props.metrics.obsMean))
            )
        );


        // creating full chart component    
        var fullChart = new React.DOM.div({className: 'line-chart'},
            new ReactChartLine({
                data: data,
                redraw: true,
                options: {
                    scaleShowVerticalLines: false,
                    pointHitDetectionRadius: 4,
                    pointDot: false
                }
            }),
            sumLegend
        );

		return fullChart;
	}

});


module.exports = LineChart;
