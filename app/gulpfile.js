"use strict";

var gulp = require('gulp');
var server = require('gulp-express');
// var livereload = require('gulp-livereload');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
// var watchify = require('watchify');

gulp.task('serve', function () {
    server.run(['./server/index.js']);
});

gulp.task('buildAdmin', function(){
    browserifyShare('Admin');
});

gulp.task('buildMap', function(){
    browserifyShare('Map');
});

gulp.task('watch', function() {
    console.log('Watching');
    var serverWatcher = gulp.watch('./server/**', function(){
        server.stop();
        gulp.run('serve');
    });

    var adminWatcher = gulp.watch('./clients/Admin/src/**', ['buildAdmin']);
    var mapWatcher = gulp.watch('./clients/Map/src/**', ['buildMap']);

    adminWatcher.on('change', function(event) {
        console.log('*** Admin *** File ' + event.path + ' was ' + event.type + ', running tasks...');
        // livereload({
        //     host: 1234,
        //     reloadPage: './clients/Admin/index.html'
        // });
    });
    mapWatcher.on('change', function(event) {
        console.log('*** Map *** File ' + event.path + ' was ' + event.type + ', running tasks...');
        // livereload.changed(event.path)
    });
});


function browserifyShare(app){
    var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true
    });
    // b = watchify(b);
    // b.on('update', function(){
    //     bundleShare(b);
    // });
    
    b.add('./clients/' + app + '/src/main.js');
    bundleShare(b, app);
}

function bundleShare(b, name) {
    b.bundle()
    .pipe(source('./clients/' + name + '_app.js'))
    .pipe(gulp.dest('.'))
    .on('error', function (err) {
        console.log(err.message);
    });
}

gulp.task('dev', ['serve', 'buildAdmin', 'buildMap', 'watch'], function(){
    console.log('Starting dev environnement');
});

gulp.task('prod', ['serve', 'buildAdmin', 'buildMap']);

gulp.task('default', ['serve', 'buildAdmin', 'buildMap', 'watch']);

