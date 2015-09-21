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
var path = require('path'); 
var join = path.join;

var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require("vinyl-source-stream");



function bundleShare(b, name) {
    b.bundle()
        .pipe(source( join('.', 'core', 'clients', name+'-browserify-bundle.js') ) )
        .pipe(gulp.dest('.'))
        .on('error', function (err) {
            console.error('bundleShare error', err.message);
        });
}

function browserifyShare(name){
    var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true
    });
    b.transform(reactify);
    
    b.add( join('.', 'core', 'clients', name, 'src', 'main.js') );
    bundleShare(b, name);
}

var clients = ['Dashboard', 'Admin', 'Citizen'];

clients.forEach(function(client){

    gulp.task('build-'+client, function(){
        browserifyShare(client);
    });

    gulp.task('watch-'+client, function() {
        console.log('Watching', client);
        
        var watcher = gulp.watch(path.join('./core/clients', client, 'src/**'), ['build-'+client]);
        watcher.on('change', function(event) {
            console.log('**', client, '** File ', path.relative(__dirname, event.path), 'was', event.type);
        });
    });

});

gulp.task('watch', clients.map(function(client){
    return 'watch-'+client;
}));

gulp.task('build', clients.map(function(client){
    return 'build-'+client;
}));

var dockerComposeProcess;
gulp.task('start-containers-dev', function(){
    dockerComposeProcess = spawn('docker-compose', ['-f', 'compose-dev.yml', 'up', '--force-recreate'], {stdio: 'inherit'});
});

/*
    Top-level tasks
*/

gulp.task('dev', ['start-containers-dev', 'watch', 'build']);
gulp.task('rebuild-db', function(){
    spawn('docker-compose', ['-f', 'rebuild-db.yml', 'up'], {stdio: 'inherit'});
});


