"use strict";

casper.test.begin('Count tests', 1, function suite(test) {

    casper.start('http://6element:4000').waitUntilVisible('.recyclingCenter',
    	function() { // once a recyclingCenter has been rendered
	    	console.log("Counting sensors");
	    	test.assertElementCount('.recyclingCenter', 17, "there are 17 RCs on the map initially");
	        test.done();
    	},
    	function (){ // Timeout
    		console.log("Timeout: no sensors found");
    	}, 5000);
    
});

casper.run();
