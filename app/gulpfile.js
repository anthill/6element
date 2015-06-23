"use strict;"

var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var watchify = require('watchify');


gulp.task('nodemon', function () {
   nodemon({
      script: 'server/index.js'
      , ext: 'js html'
      , env: { 'NODE_ENV': 'development' }
   })
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
   .pipe(gulp.dest('./client/'));
}

gulp.task('default', ['nodemon', 'watchify']);