"use strict";

var request = require('request');
var opening_hours = require('opening_hours');
var moment = require('moment');
var momentTZ = require('moment-timezone');

function makeSearchString(obj){

    if(obj === undefined) return '';
    
       // http://stackoverflow.com/a/3608791
    return '?' + Object.keys(obj).map(function(k){
        return encodeURI(k) + '=' + encodeURI(obj[k]);
    })
    .join('&');
}

function sendRequest(url, place, attribute){

    return new Promise(

        function(resolve, reject){

            request({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }, function(error, response, body){
                
                if (!error) {

                    if(response !== undefined && response.statusCode < 400){
                        try {
                            var clone = place.measures ?    Object.assign({}, place) :
                                                            Object.assign({'measures': []}, place);
                            clone.measures[attribute] = JSON.parse(body);
                            resolve(clone);
                        } catch(e) {
                            console.log("Cannot parse body in request ", e);
                            resolve(place);
                        }  
                    } 
                    else 
                    {
                        console.log(Object.assign(
                            new Error('HTTP error because of bad status code ' + body),
                            {
                                HTTPstatus: typeof response === 'undefined'?'':response.statusCode,
                                text: body,
                                error: error
                            }
                        ));
                        resolve(place);
                    }
                }
                else 
                {
                    console.log(Object.assign(

                        new Error('HTTP error'),
                        {
                            HTTPstatus: typeof response === 'undefined'?'':response.statusCode,
                            text: body,
                            error: error
                        }
                    ));
                    resolve(place);
                }
            });
        }
    );
}

function processMeasures(place, start, end, mode){

    var oh = place.opening_hours === null ? undefined :
            new opening_hours(place.opening_hours);
        
    var results = {'Affluence' : []};

    // Transform signal strength
    var measures = [];
    if( place.measures !== undefined &&
        place.measures.today !== undefined){

        measures = place.measures.today.map(function(measure){
            var date = new Date(measure.date);              
            return { date: date, signals: measure.value.length }
        });
    }

    var max = ( place.measures !== undefined && 
                place.measures.latest !== undefined) ? 
                place.measures.latest.max: 0;
    var nbTicksX = (20-8)*4; // every 15 minutes from 8am to 8pm
    var now = momentTZ().tz('Europe/Paris').toDate();

    // For each tick of 15 minutes
    for (var i = 0; i<nbTicksX; ++i) {

        var beginTick   = moment(start).add(15*i,'minutes').toDate();
        var endTick     = moment(start).add(15*(i+1),'minutes').toDate();
        
        var date = new Date(now);
        date.setHours(8+Math.floor(i/4),i*15%60, 0);

        var isOpen = oh ? oh.getState(date) : true;
        if(!isOpen){
            results.Affluence.push(-2);//closed
        }
        else if(beginTick > now || measures.length === 0){
            results.Affluence.push(-1);//unknown    
        }
        else{
            // Filter values
            var values = measures
            .filter(function(measure){
                return beginTick <= measure.date 
                    && measure.date < endTick;
            })
            .map(function(measure){
                return measure.signals;
            });

            // Compute an average
            var avg = (values.reduce(function(sum, a) {
                return sum + a;
            }, 0) / (values.length || 1)) * 100 / max;   
            
            // Fill series
            results.Affluence.push(Math.floor(avg));
        }
    }

    if(mode === 'citizen') return results;

    // List of bins that changed
    measures = [];
    if( place.measures !== undefined &&
        place.measures.bins !== undefined){

        measures = place.measures.bins;
    }

    var ticksY = [];
    measures.forEach(function(measureBin){
        if(ticksY.indexOf(measureBin.value.id) === -1){
            ticksY.push(measureBin.value.id);
        }
    });

    ticksY.forEach(function(binName, index){

        results[binName] = [];
        for (var i = 0; i<=nbTicksX; ++i) results[binName].push(0);

        //console.log('>', binName);
        var iTickXStart = 0;
        var lastAvailabity = true;

        measures
        .filter(function(measure){
            return measure.value.id === binName;
        })
        .map(function(measure){
            var date = new Date(measure.date); // UTC -> Local                   
            return { date: date, bin: measure.value }
        })
        .sort(function(m1, m2){
            return m1.date - m2.date;
        })
        .forEach(function(measure){

            // 1) we go Backward:
            // for each tick unfilled before a measure
            // we fill with the inverse of status
            // if bin is unvailable at 12am, it was "available" before 12am

            // For each tick of 15 minutes included
            var iTickXEnd = iTickXStart;
            for (var i = 0; i<nbTicksX; ++i) {

                var beginTick   = moment(start).add(15*i,'minutes').toDate();
                var endTick     = moment(start).add(15*(i+1),'minutes').toDate();

                if(measure.date < endTick) break;
                if(endTick > now ) break;

                iTickXEnd = i;

                // Color 
                // We invert values:
                // if bin is unvailable at 12am, it was "available" before 12am -> Green
                lastAvailabity = measure.bin.a;
                if(lastAvailabity === false){
                    results[binName][i] = 0;// available => green
                }
                else {
                    results[binName][i] = 100;// unavailable => red
                }
            }
            iTickXStart = iTickXEnd;
        });

        // 2) For the rest of the day, we expand the last status of avilability
        for (var i = iTickXStart; i<=nbTicksX; ++i) {
            
            var beginTick   = moment(start).add(15*i,'minutes').toDate();
            var endTick     = moment(start).add(15*(i+1),'minutes').toDate();

            // This time, we go forward so do not invert values:
            var isOpen = oh ? oh.getState(beginTick) : true;
            if(beginTick > now ){
                results[binName][i] = -1;//unknown    
            }
            else if(lastAvailabity === true){
                results[binName][i] = 0;
            }
            else {
                results[binName][i] = 100;
            }
        }
    });
    
    return results;
}

module.exports = function(selection){

    var origin = 'https://pheromon.ants.builders';
    
    return Promise.all(

        selection.places.map(function(place){

            return new Promise(function(resolve, reject){

                var start   = momentTZ.tz(selection.date, 'Europe/Paris').add(8,'hours').toDate();
                var end     = momentTZ.tz(selection.date, 'Europe/Paris').add(20,'hours').toDate();

                var parameters = {
                    id: place.pheromon_id,
                    type: undefined,
                    start: start,
                    end: end
                }
               
                if( place.pheromon_id === null ||
                    place.pheromon_id === undefined){

                    place['results'] = processMeasures(place, parameters.start, parameters.end);
                    return resolve(place);
                }

                // 1. Latest
                sendRequest(origin + '/placeLatestMeasurement/' + place.pheromon_id + '/wifi', place, 'latest')
                .then(function(placeWithLatest){
                  
                    // 2. wifi
                    parameters.type = 'wifi';
                    
                    sendRequest(origin + '/measurements/place/raw' + makeSearchString(parameters), placeWithLatest, 'today')
                    .then(function(placeWithToday){

                       
                        if(selection.mode === 'citizen'){
                             // Process measures 
                            placeWithToday['results'] = processMeasures(placeWithToday, parameters.start, parameters.end, selection.mode);
                            return resolve(placeWithToday);
                        }
                        else {

                            // 3. bins
                            parameters.type = 'bin';
                            
                            sendRequest(origin + '/measurements/place/raw' + makeSearchString(parameters), placeWithToday, 'bins')
                            .then(function(placeWithBins){

                                placeWithBins['results'] = processMeasures(placeWithBins, parameters.start, parameters.end, selection.mode);
                                return resolve(placeWithBins);
                            })
                            .catch(function(error){
                                console.log(error);
                            })  
                        }
                    })
                    .catch(function(error){
                        console.log(error);
                    })  
                }) 
                .catch(function(error){
                    console.log(error);
                })  
            })         
        })
    );  
}
