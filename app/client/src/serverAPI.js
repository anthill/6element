"use strict";

function sendReq(method, url, data){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();

        xhr.open(method, url);
        if(data !== undefined && typeof data !== 'string' && !(data instanceof FormData))
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.responseType = 'json';

        xhr.addEventListener('load', function(){
            if(xhr.status < 400)
                resolve(xhr.response);
            else{
                reject(new Error('HTTP error ' + xhr.status + ' ' + xhr.responseText));
            }

        });

        xhr.addEventListener('error', reject);

        if(data === undefined || typeof data === 'string' || data instanceof FormData)
            xhr.send(data);
        else
            xhr.send(JSON.stringify(data));
    });
}

module.exports = {
    getRecyclingCenters: function(){
        return sendReq('GET', '/live-affluence');
    },
    getRecyclingCenterDetails: function(rcId){
        return sendReq('GET', '/recycling-center/'+rcId);
    }
};
