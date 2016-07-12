'use strict';

function formatDate (date) {

    function pad (number) {
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

 function getSeries (xGreen, yGreen, xOrange, yOrange, xRed, yRed, xGrey, yGrey){

    var size = 11;
    // Bind chart structure
    return [
        {
            type: 'scatter',
            name: 'green',
            showlegend: false,
            x: xGreen,
            y: yGreen,
            marker: {
                size: size,
                symbol: 'circle',
                color: '#7fdc2b'
            },
            mode: 'markers',
            hoverinfo: 'none'
        },
        {
            type: 'scatter',
            name: 'orange',
            showlegend: false,
            x: xOrange,
            y: yOrange,
            marker: {
                size: size,
                symbol: 'circle',
                color: '#ffb800'
            },
            mode: 'markers',
            hoverinfo: 'none'
        },
        {
            type: 'scatter',
            name: 'red',
            showlegend: false,
            x: xRed,
            y: yRed,
            marker: {
                size: size,
                symbol: 'circle',
                color: '#ff3b6c'
            },
            mode: 'markers',
            hoverinfo: 'none'
        },
        {
            type: 'scatter',
            name: 'grey',
            showlegend: false,
            x: xGrey,
            y: yGrey,
            marker: {
                size: size,
                symbol: 'circle',
                color: '#F5F5F5'
            },
            mode: 'markers',
            hoverinfo: 'none'
        }
    ];

 } 

function draw(node, data){

    var width = node.offsetWidth;

    // Series
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

        var isAffluence = tickY === 'Affluence'; 

        var prev = -2;
 
        // For each tick of 15 minutes
        for (var i = 0; i<data[tickY].length; ++i) {

            var date = new Date(now);
            date.setHours(8+Math.floor(i/4),i*15%60, 0);
            var strDate = formatDate(date);

            var value = data[tickY][i];

            // If opening or closing, new tick
            var indicator = value;
            if( isAffluence &&
                ((prev===-2 && value!==-2) || 
                (prev!==-2 && value===-2))){

                if(ticksX.indexOf(strDate) === -1)
                    ticksX.push(strDate);

                if(prev!==-2 && value===-2){
                    indicator = prev;
                }
            }
        
            // Color 
            if(indicator === -2 && isAffluence){
                //nothing, it's closed
                xGrey.push(strDate);
                yGrey.push(-10);
            } 
            else if(indicator === -1){
                //unknown, let's put in grey
                xGrey.push(strDate);
                yGrey.push(isAffluence?-10 : -20*index-20);
            }
            else if(indicator < 40){
                xGreen.push(strDate);
                yGreen.push(isAffluence?-10 : -20*index-20);
            } 
            else if(40 <= indicator && indicator < 70){
                xOrange.push(strDate);
                yOrange.push(isAffluence?-10 : -20*index-20);
            }
            else {         
                xRed.push(strDate);
                yRed.push(isAffluence?-10 : -20*index-20);
            }

            prev = value;
        }    
    });
    

    var traces = getSeries(xGreen, yGreen, xOrange, yOrange, xRed, yRed, xGrey, yGrey);
    
    // Legend on left
    var tickvals = []; 
    var ticktext = [];
    var nbCaractMax = width > 350 ? 12 : 9; // 'A' 'f' 'f' 'l' 'u' 'e' 'n' 'c' 'e'
    ticksY.forEach(function(tickY, index){

        tickY = tickY.replace('_1','');

        // Value on Yaxis
        if(index === 0) tickvals.push(-10);
        else tickvals.push(-20*index-20);
        
        // Label
        if(tickY.length > nbCaractMax+1)
            tickY = tickY.substr(0,nbCaractMax)+'.';
        ticktext.push(tickY);
        if(tickY.length > nbCaractMax)
            nbCaractMax = tickY.length;
    });
    var minTick = ticksY.length*-20-20;
        
    Plotly.newPlot( node, traces, // eslint-disable-line
    {
        xaxis:{
            type: 'date',
            tickformat:'%H:%M',
            tickvals: ticksX,
            range: [start.valueOf()-10*60*1000, end.valueOf()+10*60*1000],
            //showgrid: true
        },
        yaxis:{
            range: [minTick,0],
            tickvals: tickvals,
            ticktext: ticktext,
            showline: false,
            showgrid: false,
            zeroline: false
        },
        margin: { t: 10, b: 30, l: nbCaractMax*7+10, r: 10} 
    }, {showLink: false, displayModeBar: false} );

}

function drawAllCharts(){

    var list = document.getElementsByClassName('data');
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

