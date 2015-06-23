"use strict;"

var gulp = require('gulp');
var server = require('gulp-express');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var watchify = require('watchify');

gulp.task('servedev', function () {
    server.run(['./server/index.js']);
    gulp.watch(['./server/*.js'], [server.run]);
});

gulp.task('serveprod', function () {
    server.run(['./server/index.js']);
});

gulp.task('watchify', function(){
   browserifyShare();
});


function browserifyShare(){
   var b = browserify({
      cache: {},
      packageCache: {},
      fullPaths: true
   });
   b = watchify(b);
   b.on('update', function(){
      bundleShare(b);
   });
  
   b.add('./client/src/main.js');
   bundleShare(b);
}

function bundleShare(b) {
  b.bundle()
   .pipe(source('browserify-bundle.js'))
   .pipe(gulp.dest('./client/'))
   .on('error', function (err) {
      console.log(err.message);
   });
}

gulp.task('dev', ['servedev', 'watchify'], function(){
   livereload.listen(1234);
   gulp.watch("./client/src/*", ["watchify"], function(e){
      livereload.changed(e.path);
   });
});

gulp.task('prod', ['serveprod', 'watchify']);

gulp.task('default', ['servedev', 'watchify'], function(){
   gulp.watch("./client/src/*", ["watchify"]);
});
