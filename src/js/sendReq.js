'use strict';

module.exports = function (method, url, headers, data){
    headers = Object.assign({Accept: 'application/json'}, headers || {});

    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();

        xhr.open(method, url);
        if(data !== undefined && typeof data !== 'string' && !(data instanceof FormData))
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        Object.keys(headers).forEach(function(header){
            var value = headers[header];

            xhr.setRequestHeader(header, value);
        });

        xhr.responseType = 'json';

        xhr.addEventListener('load', function(){
            if(xhr.status < 400){
                resolve(xhr.response);
            } else {
                reject(Object.assign(
                    new Error('HTTP error'),
                    {
                        HTTPstatus: xhr.status,
                        // text: xhr.responseText,
                        error: 'unknown'
                    }
                ));
            }    
        });

        xhr.addEventListener('error', reject);

        if(data === undefined || typeof data === 'string' || data instanceof FormData)
            xhr.send(data);
        else
            xhr.send(JSON.stringify(data));
    });
};
