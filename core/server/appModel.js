"use strict";

// This is the 'model' used by 6element app to improve the measurements correlation with the dataset

var ubique = require('ubique');
var database = require('../database');
require('es6-shim')

var SECOND = 1000;
var MINUTE = SECOND * 60;

var DEBUG = process.env.NODE_ENV === "development" ? true : false;

var debug = function() {
    if (DEBUG) {
        [].unshift.call(arguments, "[DEBUG 6element] ");
        console.log.apply(console, arguments);
    }
}

// mix measurements and real values from the dataset for one place ID
function mixMeasurementsAndRealValues(measurements, realValues, id) {
    var toSend = [];
    var everything = [];

    // Make an array with everything
    everything = everything.concat(measurements);
    everything = everything.concat(realValues);

    // Sort by date
    everything.sort(function (data1, data2) {
        return data1.measurement_date.getTime() - data2.measurement_date.getTime();
    })

    var nbRealValues = 0;
    var lastMeasurementDate = new Date(0);

    // Pass through this array
    everything.forEach(function (data) {
        if (!data) return;
        if (!data.real) { // If the data is a measurement
            lastMeasurementDate = data.measurement_date;
            // Add to the final array
            toSend.push({
                id: id,
                measurement_date: data.measurement_date,
                measurement: data.signal_strengths.length,
                signal_strengths: data.signal_strengths,
                realMeasurement: nbRealValues
            });
            nbRealValues = 0;
        }
        else { // If the data is a real value
            if (data.measurement_date - lastMeasurementDate >= 10 * MINUTE) {  // 10 minutes without measurement
                toSend.push({
                    id: id, 
                    measurement_date: data.measurement_date, 
                    measurement: null, // Not 0, because dygraphs handle null as 'no data'
                    signal_strengths: [],
                    realMeasurement: nbRealValues
                });
                lastMeasurementDate = data.measurement_date;
                nbRealValues = 0;
            }
            ++nbRealValues;
        }
    })

    return (toSend) 
    // Array of Objects : [{id, measurementDate, measurement, signal_strengths, realMeasurement}, ...]
}



var modelConfig = {min: -100, max: 0, employee: 0};


// train the 'model'
function trainModel(realDatas) {

    var allMeasurements = [];
    var allDatas = [];

    var bestCorrelation = {min:undefined, max:undefined, value:undefined};
    var bestRMSE;

    var PPlace = [];

    // Get every measurements and every datas for every places.
    database.complexQueries.getAllPlacesInfos()
    .then(function (places) {
        places.forEach(function (place) {

            if (realDatas[place.id] !== undefined) {
                PPlace.push(new Promise(function (resolve, reject) {

                    database.complexQueries.getPlaceMeasurements(place.id)
                    .then(function (measurements) {

                        var mixed = mixMeasurementsAndRealValues(measurements, realDatas[place.id], place.id);
                        mixed.forEach(function (data) {

                            if (data.signal_strengths && data.signal_strengths.length && data.realMeasurement) {
                                allMeasurements.push({signal_strengths: data.signal_strengths});
                                allDatas.push(data.realMeasurement);
                            }
                        })
                        resolve();
                    })
                    .catch(function (err) {
                        console.log('ERROR while training model (data retrieving):', err.stack)
                        reject (err)
                    })
                }));
            }
        });

        Promise.all(PPlace)
        .then(function () {

            function addModelResult(_min, _max){
                return function(measurement){
                    modelResults.push(modelForward(measurement, {min: _min, max: _max, employee: 0}));
                    // modelResults.push(measurement.signal_strengths ? measurement.signal_strengths.length : null);
                }

            }

            // Train the 'model'
            for (var min = -100; min <= -50; min += 5) {
                for (var max = 0; max >= -50; max -= 5) {

                    var modelResults = []; // Array of int
                    allMeasurements.forEach(addModelResult(min, max))

                    // get stats for this try
                    var resultStats = getStats(modelResults, allDatas);

                    if (bestCorrelation.value === undefined || Math.abs(resultStats.correlation) > Math.abs(bestCorrelation.value)) {
                        bestCorrelation = {min: min, max: max, value: resultStats.correlation}; 
                    }

                    if (bestRMSE === undefined || Math.abs(resultStats.rmse) < Math.abs(bestRMSE)) {
                        bestRMSE = resultStats.rmse;
                    }

                }
            }

            console.log('Best config :', {employee: Math.round(bestRMSE), min: bestCorrelation.min, max: bestCorrelation.max});
            console.log('Best results :', {rmse: bestRMSE - Math.round(bestRMSE), correlation: bestCorrelation.value})
            modelConfig = {employee: Math.round(bestRMSE), min: bestCorrelation.min, max: bestCorrelation.max};
        })
        .catch(function (err) {
            console.log('ERROR while training the model (training):', err.stack)
        })
    })
    .catch(function (err) {
        console.log('ERROR while training the mode:', err.stack)
    });
}

// takes one measurement and return the number of correct signals.
function modelForward(measurement, config) {
    if ((config || modelConfig).min === undefined ||
        (config || modelConfig).max === undefined ||
        (config || modelConfig).employee === undefined)
        return (measurement);

        var nbSignals = 0;
        if (!measurement.signal_strengths) return null;
        measurement.signal_strengths.forEach(function (signal) {
            if (signal >= (config || modelConfig).min && signal <= (config || modelConfig).max) {
                ++nbSignals;
            }
        })
    return (nbSignals - (config || modelConfig).employee > 0 ? nbSignals - (config || modelConfig).employee : 0);
}

// takes two arrays of int (number of people), and return some stats about them
function getStats(signalsNumbers, realDatas) {
    var correlation;
    var rmse;

    if (signalsNumbers.length === realDatas.length && signalsNumbers.length) {
            correlation = ubique.corrcoef(signalsNumbers, realDatas)[0][1];

            var sum = 0;
            for (var i = 0; i < signalsNumbers.length; i++) {
                sum += Math.pow(signalsNumbers[i] - realDatas[i], 2);
            }
            rmse = Math.sqrt(sum / i);
    }
    else {
        debug('measurements length != realDatas length :', signalsNumbers.length, realDatas.length)
    }
    return ({rmse: rmse, correlation: correlation})
}

module.exports = {config: modelConfig, train: trainModel, getStats: getStats, forward: modelForward}
