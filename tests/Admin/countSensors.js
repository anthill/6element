"use strict";

casper.test.begin('Count tests', 1, function suite(test) {

	// test.assert( 2 === 3);

    casper.start('http://6element:4000/admin');

    casper.waitForSelector('.ant',
    	function success () { // once a recyclingCenter has been rendered
	    	console.log("Counting ants");
	    	test.assertElementCount('.ant', 13, "there are 12 ants with both place and sensor initially");
	        // test.done();
    	},
    	function failure (){ // Timeout
    		console.log("Timeout: no ant found");
    	}, 2000);

    casper.run(function(){
    	test.done();
    });
    
});
