'use strict';

casper.test.begin('Title test', 1, function suite(test) {
    casper.start("http://6element:4000/admin", function() {
        test.assertTitle("Ants - 6element Admin", "Title is the one expected");
    });

    casper.run(function() {
        test.done();
    });
});