'use strict';

var React = require("react");

/*
interface LineChart Props{
    measurements: [{id: 18, measurement: 18, measurement_date: "2015-07-09T12:45:53.629Z"}]
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
            return [date, x.measurement];
        });

        new Dygraph(

            React.findDOMNode(this.refs.tsNumber),

            data,
            {
                labels: [ "time", "Traces wifi" ]
            }

          );

    },

	render: function(){

        return new React.DOM.div({className: 'line-chart'},
            React.DOM.div({ref: 'tsNumber'})
        );
	}

});


module.exports = LineChart;
