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

gulp.task('watchifyAdmin', function(){
	browserifyShare('Admin');
});

gulp.task('watchifyMap', function(){
	browserifyShare('Map');
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

gulp.task('dev', ['servedev', 'watchifyAdmin', 'watchifyMap'], function(){
	livereload.listen(1234);
	gulp.watch("./clients/Map/*", ["watchifyMap"], function(e){
		console.log('Changed: ', e); // can't find any log with this => where is it ?
		livereload.changed(e.path); // this doesn't work for now
	});
	gulp.watch("./clients/Admin/*", ["watchifyAdmin"], function(e){
		console.log('Changed: ', e); // can't find any log with this => where is it ?
		livereload.changed(e.path); // this doesn't work for now
	});
});

gulp.task('prod', ['serveprod', 'watchifyAdmin', 'watchifyMap']);

gulp.task('default', ['servedev', 'watchifyAdmin', 'watchifyMap'], function(){
	gulp.watch("./clients/*", ["watchifyAdmin", 'watchifyMap']);
});
