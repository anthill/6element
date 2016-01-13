'use strict';

var fromUTC = function(str){

    var tmp = str.split('T');
    var vDate = tmp[0].split('-');
    var vTime = tmp[1].split(':');

    var yyyy = parseInt(vDate[0]);
    var MM = parseInt(vDate[1]);
    var dd = parseInt(vDate[2]);
    var hh = parseInt(vTime[0]);
    var mm = parseInt(vTime[1]);
    var ss = parseInt(vTime[2]);

    return new Date(Date.UTC(yyyy,MM-1,dd,hh,mm,ss));
}

var formatDate = function(date) {

    var pad = function(number) {
        if ( number < 10 ) {
            return '0' + number;
        }
        return number;
    }
    return date.getFullYear() +
        '-' + pad( date.getMonth() + 1 ) +
        '-' + pad( date.getDate() ) +
        ' ' + pad( date.getHours() ) +
        ':' + pad( date.getMinutes() ) +
        ':' + pad( date.getSeconds() ) +
        '.000000';
 }

 var getSeries = function(xSignals, ySignals, xGreen, yGreen, xOrange, yOrange, xRed, yRed, xGrey, yGrey){

    // Bind chart structure
    return [{
            type: 'scatter',
            name: 'Saturation(%)',
            showlegend: false,
            x: xSignals,
            y: ySignals,
            marker: {
            symbol: "x",
                color: '#E400B9'
            },
            line: {shape: 'spline'},
            mode: 'lines',
            hoverinfo: "none"
        },
        {
            type: 'scatter',
            name: 'green',
            showlegend: false,
            x: xGreen,
            y: yGreen,
            marker: {
                symbol: "square",
                color: '#7fdc2b'
            },
            mode: 'markers',
            hoverinfo: "none"
        },
        {
            type: 'scatter',
            name: 'orange',
            showlegend: false,
            x: xOrange,
            y: yOrange,
            marker: {
                symbol: "square",
                color: '#ffb800'
            },
            mode: 'markers',
            hoverinfo: "none"
        },
        {
            type: 'scatter',
            name: 'red',
            showlegend: false,
            x: xRed,
            y: yRed,
            marker: {
                symbol: "square",
                color: '#ff3b6c'
            },
            mode: 'markers',
            hoverinfo: "none"
        },
        {
            type: 'scatter',
            name: 'grey',
            showlegend: false,
            x: xGrey,
            y: yGrey,
            marker: {
                symbol: "square",
                color: '#FFFFFF'
            },
            mode: 'markers',
            hoverinfo: "none"
        }
    ];

 } 

function draw(node, data){

    var width = node.offsetWidth;

    // Series
    var xSignals = [], ySignals = []; // Signal curve
    var xGreen = [], yGreen = []; // Colored squares
    var xOrange = [], yOrange = []; 
    var xRed = [], yRed = []; 
    var xGrey = [], yGrey = []; 

	var now = new Date();
	// binding inputs for API
	var start = new Date(now);
	start.setHours(8,0,0,0);
	var end = new Date(now);
	end.setHours(20,0,0,0);

    var ticksX = [];
    var ticksY = Object.keys(data);

    ticksY.forEach(function(tickY, index){

        var isAffluence = tickY === "Affluence"; 

        var prev = -2;
 
        // For each tick of 15 minutes
        for (var i = 0; i<data[tickY].length; ++i) {

            var date = new Date(now);
            date.setHours(8+Math.floor(i/4),i*15%60, 0);
            var strDate = formatDate(date);

            var value = data[tickY][i];

            // If opening or closing, new tick
            if( isAffluence &&
                ((prev===-2 && value!==-2) || 
                (prev!==-2 && value===-2))){
                if(ticksX.indexOf(strDate) === -1)
                    ticksX.push(strDate);
            }
        
            if(value >= 0 && isAffluence){
                xSignals.push(strDate);
                ySignals.push(value);
            }

             // Color 
            if(value === -2){
                //nothing, it's closed
            } 
            else if(value === -1){
                //unknown, let's put in grey
                xGrey.push(strDate);
                yGrey.push(isAffluence?-10 : -20*index-30);
            }
            else if(value < 30){
                xGreen.push(strDate);
                yGreen.push(isAffluence?-10 : -20*index-30);
            } 
            else if(30 <= value && value < 50){
                xOrange.push(strDate);
                yOrange.push(isAffluence?-10 : -20*index-30);
            }
            else {         
                xRed.push(strDate);
                yRed.push(isAffluence?-10 : -20*index-30);
            }

            prev = value;
        }

    
    });
    
   	var traces = getSeries(xSignals, ySignals, xGreen, yGreen, xOrange, yOrange, xRed, yRed, xGrey, yGrey);
    
    // Legend on left
    var tickvals = []; 
    var ticktext = [];
	var nbCaractMax = width > 350 ? 12 : 9; // 'A' 'f' 'f' 'l' 'u' 'e' 'n' 'c' 'e'
	ticksY.forEach(function(tickY, index){

        tickY = tickY.replace("_1","");

        // Value on Yaxis
        if(index === 0) tickvals.push(-10);
        else tickvals.push(-20*index-30);
        
        // Label
        if(tickY.length > nbCaractMax+1)
            tickY = tickY.substr(0,nbCaractMax)+'.';
        ticktext.push(tickY);
		if(tickY.length > nbCaractMax)
			nbCaractMax = tickY.length;
	});
	var minTick = ticksY.length*-20 - 40;
	    
    Plotly.newPlot( node, traces, 
    {
        xaxis:{
            type: 'date',
            tickformat:'%H:%M',
            tickvals: ticksX,
            range: [start.valueOf(), end.valueOf()],
            showgrid: true
        },
        yaxis:{
            range: [minTick,100],
            tickvals: tickvals,
            ticktext: ticktext,
            showline: false,
            showgrid: false
        },
        margin: { t: 0, b: 30, l: nbCaractMax*7, r: 20} 
    }, {showLink: false, displayModeBar: false} );

}

function drawAllCharts(){

	var list = document.getElementsByClassName("data");
	for(var i= 0; i<list.length; ++i){

		var node = list[i];
        var id = node.id.replace('data-','');
        var data = [];
        if(node.innerHTML !== ''){
            data = JSON.parse(node.innerHTML);
        }
        draw(document.getElementById('chart-'+id), data);
	}
}

drawAllCharts();

