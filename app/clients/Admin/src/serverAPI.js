"use strict";

var sendReq = require('../../_common/js/sendReq.js');

module.exports = {
    getAllPlacesLiveAffluence: function(){
        return sendReq('GET', '/live-affluence');
    },
    getPlaceMeasurements: function(id){
        return sendReq('GET', '/place/' + id);
    },
    getAllSensors: function(){
        return sendReq('GET', '/sensors');
    },
    updatePlace: function(data){
    	return sendReq('POST', '/updatePlace', data);
    }
};
