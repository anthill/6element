"use strict";

/*
    This gulpfile is an "outer" gulpfile that manages starting docker containers and watching/rebuilding files for dev purposes
    
    
```bash
gulp dev # prepares the dev environment
```

*/

require('es6-shim');

var spawn = require('child_process').spawn;
var fs = require("fs");
var join = require('path').join;

var gulp = require('gulp');


gulp.task('watch-dashboard', function() {
    console.log('Watching');
    gulp.watch(['./server/**', './database/**'], function(){
        server.stop();
        gulp.run('serve-dashboard');
    });

    var dashboardWatcher = gulp.watch('./clients/Dashboard/src/**', ['build-dashboard']);

    dashboardWatcher.on('change', function(event) {
        console.log('*** Dashboard *** File ' + event.path + ' was ' + event.type + ', running tasks...');
        // livereload.changed(event.path)
    });
});

gulp.task('watch-admin', function() {
    console.log('Watching admin');
    gulp.watch(['./server/**', './database/**'], function(){
        server.stop();
        gulp.run('serve-admin');
    });

    var adminWatcher = gulp.watch('./clients/Admin/src/**', ['build-admin']);
   
    adminWatcher.on('change', function(event) {
        console.log('*** Admin *** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

});


gulp.task('start-containers-dev', function(cb){
    var p = spawn('docker-compose', ['-f', 'compose-dev.yml', 'up']);
    
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
});



gulp.task('watch', ['watch-dashboard', 'watch-admin']);

gulp.task('dev', ['start-containers-dev', 'watch']);


