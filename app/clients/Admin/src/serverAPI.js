"use strict";

var sendReq = require('../../_common/js/sendReq.js');

module.exports = {
    getRecyclingCenters: function(){
        return sendReq('GET', '/live-affluence');
    },
    getRecyclingCenterDetails: function(rcId){
        return sendReq('GET', '/recycling-center/'+rcId);
    },
    getAllSensors: function(){
        return sendReq('GET', '/sensors');
    }
};
