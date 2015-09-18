"use strict;"

var $ = require('jquery');

module.exports = function requestData(data){

	return new Promise(function(resolve, reject){

		$.ajax({
	      type: 'POST',
	      url: '/search',
	      data: JSON.stringify(data),
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