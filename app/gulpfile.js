"use strict";

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

gulp.task('buildAdmin', function(){
    browserifyShare('Admin');
});

gulp.task('buildMap', function(){
    browserifyShare('Map');
});

gulp.task('watch-app', function() {
    console.log('Watching');
    var serverWatcher = gulp.watch(['./server/**', './database/**'], function(){
        server.stop();
        gulp.run('serve-app');
    });

    var mapWatcher = gulp.watch('./clients/Map/src/**', ['buildMap']);

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

    var adminWatcher = gulp.watch('./clients/Admin/src/**', ['buildAdmin']);
   
    adminWatcher.on('change', function(event) {
        console.log('*** Admin *** File ' + event.path + ' was ' + event.type + ', running tasks...');
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

gulp.task('admin-dev', ['serve-admin', 'buildAdmin', 'watch-admin'], function(){
    console.log('Starting admin in dev');
});

gulp.task('admin-prod', ['serve-admin', 'buildAdmin']);

gulp.task('app-dev', ['serve-app', 'buildMap', 'watch-app'], function(){
    console.log('Starting app in dev');
});

gulp.task('app-prod', ['serve-app', 'buildMap']);

gulp.task('default', ['serve-app', 'serve-prod', 'buildAdmin', 'buildMap', 'watch']);

