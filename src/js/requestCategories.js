"use strict;"

var $ = require('jquery');

module.exports = function requestNetworks(data){

	return new Promise(function(resolve, reject){

		$.ajax({
	      type: 'GET',
	      url: '/categories',
	      contentType: 'application/json',
	      success: function(result) {
	        resolve(result);
	      },
	      error: function(xhr, status, err) {
	        reject({status: status, message: err});
	      }
	    });
	});
}