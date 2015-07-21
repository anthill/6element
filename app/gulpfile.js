"use strict";

var join = require('path').join;

var gulp = require('gulp');
var server = require('gulp-express');
// var livereload = require('gulp-livereload');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
// var watchify = require('watchify');

gulp.task('serve-app', function () {
    server.run(['./server/app.js']);
});

gulp.task('serve-admin', function () {
    server.run(['./server/admin.js']);
});

gulp.task('build-admin', function(){
    browserifyShare('Admin');
});

gulp.task('build-app', function(){
    browserifyShare('Map');
});

gulp.task('watch-app', function() {
    console.log('Watching');
    var serverWatcher = gulp.watch(['./server/**', './database/**'], function(){
        server.stop();
        gulp.run('serve-app');
    });

    var mapWatcher = gulp.watch('./clients/Map/src/**', ['build-app']);

    mapWatcher.on('change', function(event) {
        console.log('*** Map *** File ' + event.path + ' was ' + event.type + ', running tasks...');
        // livereload.changed(event.path)
    });
});

gulp.task('watch-admin', function() {
    console.log('Watching admin');
    var serverWatcher = gulp.watch(['./server/**', './database/**'], function(){
        server.stop();
        gulp.run('serve-admin');
    });

    var adminWatcher = gulp.watch('./clients/Admin/src/**', ['build-admin']);
   
    adminWatcher.on('change', function(event) {
        console.log('*** Admin *** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

});


function browserifyShare(name){
    var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true
    });
    
    b.add( join('./clients', name, 'src', 'main.js') );
    bundleShare(b, name);
}

function bundleShare(b, name) {
    b.bundle()
    .pipe(source( join('./clients', name+'-browserify-bundle.js') ) )
    .pipe(gulp.dest('.'))
    .on('error', function (err) {
        console.log(err.message);
    });
}


/*
    Tasks used on the outside
*/
gulp.task('admin-dev', ['serve-admin', 'build-admin', 'watch-admin'], function(){
    console.log('Starting admin in dev');
});

gulp.task('admin-prod', ['serve-admin', 'build-admin']);

gulp.task('app-dev', ['serve-app', 'build-app', 'watch-app'], function(){
    console.log('Starting app in dev');
});

gulp.task('app-prod', ['serve-app', 'build-app']);
