'use strict';

// Concats every paramater in a url postifx string
function makeSearchString(obj){

    if(obj === undefined) return '';
    
    // http://stackoverflow.com/a/3608791
    return '?' + Object.keys(obj).map(function(k){
        return encodeURI(k) + '=' + encodeURI(obj[k]);
    })
    .join('&');
};


module.exports = function(request, origin){

    origin = origin || ''; // address will be interpreted as relative this way

    return {
        // SENSORS
        search: function(data){
            return request('POST', origin + '/search', data);
        },
        measurements: function(data){
            return request('GET', origin + '/measurements/place/raw' + makeSearchString(data));
        }
    };
};
