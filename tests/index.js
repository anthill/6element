'use strict';

var request = require('request');
var spawn = require('child_process').spawn;


// ping the server
var readyInterval = setInterval(function(){

    request("http://6element:4000", function(error,response,body){

        if (error) console.log('server not up yet, trying again');

        if(!error && response.statusCode === 200){
            console.log("Server up and running");
            clearInterval(readyInterval);

            var casperChild = spawn('casperjs', ['test'].concat(['src/Admin/']));

            casperChild.stdout.on('data', function (data) {
                console.log(data.toString().slice(0, -1));
            });
        }
    });

},1000);