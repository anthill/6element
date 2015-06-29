"use strict";

var sendReq = require('./sendReq.js');

module.exports = {
    getRecyclingCenters: function(){
        return sendReq('GET', '/live-affluence');
    },
    getRecyclingCenterDetails: function(rcId){
        return sendReq('GET', '/recycling-center/'+rcId);
    }
};
