"use strict";

var request = require('./prepareServerAPI')
    (require('./sendReq'), 'https://pheromon.ants.builders')
    .measurements;

var Colors = require('material-ui/lib/styles/colors');

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
 };

module.exports = function(place, start, end) {

    return new Promise(function(resolve, reject){
        
        var max = (place.measurements !== undefined) ? place.measurements.max: 0;
        var nbTicksX = (20-8)*4; // every 15 minutes from 8am to 8pm
        var now = new Date();

        var parameters = {
            id: place.properties.pheromon_id,
            type: undefined,
            start: start,
            end: end
        }

        // Series
        var xSignals = [], ySignals = []; // Signal curve
        var xGreen = [], yGreen = []; // Colored squares
        var xOrange = [], yOrange = []; 
        var xRed = [], yRed = []; 
        var xGrey = [], yGrey = []; 
        
        // Calling API for wifi
        parameters.type = 'wifi';
        request(parameters)
        .then(function(measuresWifi){

            // Transform signal strength
            var resultsWifi = measuresWifi.map(function(measureWifi){
                var date = fromUTC(measureWifi.date); // UTC -> Local               
                return { date: date, signals: measureWifi.value.length }
            });

            //console.log(resultsWifi)

            if(resultsWifi.length > 0){

                // For each tick of 15 minutes
                for (var i = 0; i<=nbTicksX; ++i) {
                
                    var beginTick = new Date(start);
                    beginTick.setHours(8+Math.floor(i/4),i*15%60, 0);
                    var endTick = new Date(end);
                    endTick.setHours(8+Math.floor((i+1)/4),(i+1)*15%60, 0);

                    // Filter values
                    var values = resultsWifi
                    .filter(function(result){
                        return beginTick <= result.date 
                            && result.date < endTick;
                    })
                    .map(function(result){
                        return result.signals;
                    });

                    // Compute an average
                    var avg = (values.reduce(function(sum, a) {
                        return sum + a;
                    }, 0) / (values.length || 1)) * 100 / max;

                    // Fill series
                    if(beginTick <= now){

                        var strDate = formatDate(beginTick);
                        xSignals.push(strDate);
                        ySignals.push(avg);

                        // Color 
                        if(avg < 30){
                            xGreen.push(strDate);
                            yGreen.push(-10);
                        } else if(30 <= avg && avg < 50){
                            xOrange.push(strDate);
                            yOrange.push(-10);
                        }
                        else {
                            xRed.push(strDate);
                            yRed.push(-10);
                        }
                    }
                }
            }
            
            // Calling API for bins
            parameters.type = 'bin';
            request(parameters)
            .then(function(measuresBins){

                // List of bins that changed
                var ticksY = [];
                measuresBins.forEach(function(measureBin){
                    if(ticksY.indexOf(measureBin.value.t) === -1){
                        ticksY.push(measureBin.value.t);
                    }
                });

                ticksY.forEach(function(binName, index){

                    //console.log('>', binName);
                    var iTickXStart = 0;
                    var lastAvailabity = true;

                    measuresBins
                    .filter(function(measure){
                        return measure.value.t === binName;
                    })
                    .map(function(measure){
                        var date = fromUTC(measure.date); // UTC -> Local                   
                        return { date: date, bin: measure.value }
                    })
                    .sort(function(m1, m2){
                        return m1.date - m2.date;
                    })
                    .forEach(function(measure){

                        //console.log(measure.date, measure.bin.a);
                        //console.log(measure.date);
                        //console.log('iTickXStart', iTickXStart);

                        // 1) we go Backward:
                        // for each tick unfilled before a measure
                        // we fill with the inverse of status
                        // if bin is unvailable at 12am, it was "available" before 12am

                        // For each tick of 15 minutes included
                        var iTickXEnd = iTickXStart;
                        for (var i = iTickXStart; i<=nbTicksX; ++i) {
                        
                            var beginTick = new Date(start);
                            beginTick.setHours(8+Math.floor(i/4),i*15%60, 0);
                            var endTick = new Date(end);
                            endTick.setHours(8+Math.floor((i+1)/4),(i+1)*15%60, 0);

                            //console.log(formatDate(beginTick), '-', formatDate(endTick))
                            //console.log(measure.date, (measure.date > endTick));
                            if(measure.date < endTick) break;
                            if(endTick > now ) break;

                            iTickXEnd = i;

                            // Color 
                            var strDate = formatDate(beginTick);
                            //console.log(i);
                            // We invert values:
                            // if bin is unvailable at 12am, it was "available" before 12am -> Green
                            lastAvailabity = measure.bin.a;
                            if(lastAvailabity === false){
                                xGreen.push(strDate);
                                yGreen.push(-20*index-50);
                            }
                            else {
                                xRed.push(strDate);
                                yRed.push(-20*index-50);
                            }
                        }
                        iTickXStart = iTickXEnd;
                    });

                    // 2) For the rest of the day, we expand the last status of avilability
                    for (var i = iTickXStart; i<=nbTicksX; ++i) {
                        
                            var beginTick = new Date(start);
                            beginTick.setHours(8+Math.floor(i/4),i*15%60, 0);
                            var endTick = new Date(end);
                            endTick.setHours(8+Math.floor((i+1)/4),(i+1)*15%60, 0);

                            if(endTick > now ) break;

                            // Color 
                            var strDate = formatDate(beginTick);
                            // This time, we go forward so do not invert values:
                            if(lastAvailabity === true){
                                xGreen.push(strDate);
                                yGreen.push(-20*index-50);
                            }
                            else {
                                xRed.push(strDate);
                                yRed.push(-20*index-50);
                            }
                        }

                });
                
                // Bind chart structure
                var traces = [{
                        type: 'scatter',
                        name: 'Saturation(%)',
                        showlegend: false,
                        x: xSignals,
                        y: ySignals,
                        marker: {
                        symbol: "x",
                            color: Colors.pink400
                        },
                        line: {shape: 'spline'},
                        mode: 'lines'
                    },
                    {
                        type: 'scatter',
                        name: 'green',
                        showlegend: false,
                        x: xGreen,
                        y: yGreen,
                        marker: {
                            symbol: "square",
                            color: Colors.green400
                        },
                        mode: 'markers'
                    },
                    {
                        type: 'scatter',
                        name: 'orange',
                        showlegend: false,
                        x: xOrange,
                        y: yOrange,
                        marker: {
                            symbol: "square",
                            color: Colors.amber300
                        },
                        mode: 'markers'
                    },
                    {
                        type: 'scatter',
                        name: 'red',
                        showlegend: false,
                        x: xRed,
                        y: yRed,
                        marker: {
                            symbol: "square",
                            color: Colors.red500
                        },
                        mode: 'markers'
                    },
                    {
                        type: 'scatter',
                        name: 'grey',
                        showlegend: false,
                        x: xGrey,
                        y: yGrey,
                        marker: {
                            symbol: "square",
                            color: Colors.blueGrey100
                        },
                        mode: 'markers'
                    }
                ];

                resolve({traces: traces, ticksY: ticksY});
            })
            .catch(function(error){
                reject(error);
            }) 
        })
        .catch(function(error){
            reject(error);
        })
    });
};
