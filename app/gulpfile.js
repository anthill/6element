"use strict;"

var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var watchify = require('watchify');


gulp.task('nodemon', function () {
   nodemon({script: 'server/index.js', ext: 'js json html', legacyWatch: true });
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
   .pipe(livereload())
   .on('error', function (err) {
      console.log(err.message);
   });
}



gulp.task('default', ['nodemon', 'watchify'], function(){
   livereload.listen();
   gulp.watch("./server/index.js", ["nodemon"]);
   gulp.watch("./client/src/*", ["watchify"]);
});
