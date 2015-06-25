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

gulp.task('buildAdmin', function(){
	browserifyShare('Admin');
});

gulp.task('buildMap', function(){
	browserifyShare('Map');
});

gulp.task('watch', function() {
	console.log('Watching');
  	gulp.watch('./clients/Admin/src/**', ['buildAdmin']);
  	gulp.watch('./clients/Map/src/**', ['buildMap']);
});


function browserifyShare(app){
	var b = browserify({
		cache: {},
		packageCache: {},
		fullPaths: true
	});
	b = watchify(b);
	b.on('update', function(){
		bundleShare(b);
	});
	
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

gulp.task('dev', ['servedev', 'buildAdmin', 'buildMap', 'watch']);

gulp.task('prod', ['serveprod', 'buildAdmin', 'buildMap']);

gulp.task('default', ['servedev', 'buildAdmin', 'buildMap', 'watch']);
