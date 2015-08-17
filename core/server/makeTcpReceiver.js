"use strict";

var EventEmitter = require('events').EventEmitter;


module.exports = function(socket, separator){

   var chunk = "";
   var d_index;
   var eventEmitter = new EventEmitter();
   
   socket.on('data', function(data) {
      // accumulate tcp stream until separator meaning new chunk
      chunk += data.toString();
      d_index = chunk.indexOf(separator);

      while (d_index > -1) {         
         message = chunk.substring(0, d_index); // Create string up until the delimiter
         eventEmitter.emit('message', message);         
         chunk = chunk.substring(d_index + 1); // Cuts off the processed chunk
         d_index = chunk.indexOf(separator); // Find the new delimiter
      };
   });
   return eventEmitter;
}