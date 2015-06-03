'use strict';

var React = require('react');
var LineChart = React.createFactory(require('./LineChart.js'));


/*

interface PanelProps{
    recyclingCenter: RecyclingCenter
}
interface PanelState{

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


var Panel = React.createClass({

    getInitialState: function(){
        return {}
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        console.log('panel props', props);
        
        var cellStyle = {border: '1px solid #AAA'};
        
        return React.DOM.div({id: 'panel'}, [
            React.DOM.h1({}, '6element - affluence déchèteries en direct'),
            
            props.recyclingCenter ?
                React.DOM.h2({}, props.recyclingCenter.name) :
                undefined,
            
            props.recyclingCenter ?
                React.DOM.table({}, [
                    React.DOM.tr({}, props.recyclingCenter.details.map(function(d){
                        return React.DOM.td({style: cellStyle}, dateLabel(d.measurement_date));
                    })),
                    React.DOM.tr({}, props.recyclingCenter.details.map(function(d){
                        return React.DOM.td({style: cellStyle}, d.measurement);
                    }))
                
                ])
            
            
            
                /*LineChart({
                    labels: dateLabels(props.recyclingCenter.details.map(function(d){
                        return d.measurement_date;
                    })),
                    observed: props.recyclingCenter.details.map(function(d){
                        return d.measurement;
                    }),
                    metrics: {}
                })*/ :
                undefined
        ]);
    }
});

module.exports = Panel;
