"use strict";

casper.test.begin('title', 1, function suite(test) {
    
    casper.start("http://localhost:4000/", function() {
        test.assertTitle("Ants - 6element App - Sketch", "6el app homepage title is the one expected");
    });

    casper.run(function() {
        test.done();
    });
    
});


casper.test.begin('basic structure', 1, function suite(test) {
    
    casper.start("http://localhost:4000/", function() {
        this.wait(2000, function(){
            test.assertElementCount('section', 4, "don't have 4 sections");
        });
        
    });

    casper.run(function() {
        test.done();
    });
    
});

casper.test.begin('Waiting message is coherent with display', 1, function suite(test) {
    
    casper.start("http://localhost:4000/", function() {
        
        //inf bound[now]===moment
        
        
    });

    casper.run(function() {
        test.done();
    });
    
});