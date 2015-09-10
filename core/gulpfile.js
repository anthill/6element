"use strict";

require('es6-shim');
var spawn = require('child_process').spawn;

var fs = require("fs");
var join = require('path').join;
var gulp = require('gulp');
var server = require('gulp-express');
// var livereload = require('gulp-livereload');
// var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
// var watchify = require('watchify');
var generateSqlDefinition = require('sql-generate');


var conString = "postgres://postgres:" + process.env.POSTGRES_PASSWORD + "@" + process.env.DB_PORT_5432_TCP_ADDR + ":5432/postgres";
var sqlOptions = {
    dsn: conString,
    omitComments: true
};

var generateDefinitions = function() {
    return new Promise(function(resolve, reject) {
        generateSqlDefinition(sqlOptions, function(err, stats) {
            if (err) {
                console.error(err);
                reject(err);
            }
            fs.writeFileSync("./database/management/declarations.js", stats.buffer);
            resolve();
        });
    });
}



// http://stackoverflow.com/a/23973536
// function swallowError(error) {
//     console.log('swallowing', error.toString());

//     this.emit('end');
// }


gulp.task('serve-dashboard', function () {
    server.run(['./server/dashboard.js']);
});

gulp.task('serve-admin', function () {
    server.run(['./server/admin.js']);
});

gulp.task('serve-citizen', function () {
    server.run(['./server/citizen.js']);
});

gulp.task('serve-endpoint', function () {
    var proc = spawn('node', ['./server/endpoint.js'])

    proc.stdout.on('data', function(buffer) {
        console.log(buffer.toString().replace('\n', ''));
    })
    proc.stderr.on('data', function(buffer) {
        console.error(buffer.toString().replace('\n', ''));
    })
    proc.on('close', function(code) {
        console.log('process closed with code ' + code)
    })
});

gulp.task('build-admin', function(){
    browserifyShare('Admin');
});

gulp.task('build-dashboard', function(){
    browserifyShare('Dashboard');
});

gulp.task('build-citizen', function(){
    browserifyShare('Citizen');
});

gulp.task('server-stop', function(){
    server.stop();
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

gulp.task('dashboard-dev', ['build-dashboard', 'serve-dashboard'/*, 'watch-dashboard'*/], function(){
    console.log('Starting dashboard in dev');
});

gulp.task('citizen-dev', ['build-citizen', 'serve-citizen'], function(){
    console.log('Starting citizen in dev');
});



gulp.task('admin-prod', ['serve-admin', 'build-admin']);

gulp.task('dashboard-prod', ['serve-dashboard', 'build-dashboard']);

gulp.task('citizen-prod', ['build-citizen', 'serve-citizen']);
