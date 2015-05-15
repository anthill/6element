'use strict';

var cachedMetadata;

module.exports = function(origin, path, args){
    return new Promise(function(resolve, reject){
        if(cachedMetadata)
            resolve(cachedMetadata);
        else{
            var argString = args.join("&");
            var xhr = new XMLHttpRequest();

            xhr.open('GET', origin+path+'?'+argString);
            xhr.responseType = 'json';

            xhr.addEventListener('load', function(){
                var recyclingCenters = xhr.response;
                resolve(recyclingCenters);
            });

            xhr.addEventListener('error', function(err){
                reject(err);
            });

            xhr.send();
        }
    });
};
