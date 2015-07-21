"use strict";

require('es6-shim');

var fs = require("fs");
var gulp = require('gulp');
var server = require('gulp-express');
// var livereload = require('gulp-livereload');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
// var watchify = require('watchify');
var generateSqlDefinition = require('sql-generate');


var conString = "postgres://postgres:" + process.env.POSTGRES_PASSWORD + "@" + process.env.DB_PORT_5432_TCP_ADDR + ":5432/postgres";
var sqlOptions = {
    dsn: conString,
    omitComments: true
};


gulp.task('init', function () {

    // wait database to be created 
    var interval = setInterval(function(){

        console.log("checking for connection.");

        require('./database/management/databaseClientP')
            .then(function(db){
                clearInterval(interval);

                // when ready, drop and create tables
                var dropAllTables = require('./database/management/dropAllTables.js');
                var createTables = require('./database/management/createTables.js');

                dropAllTables()
                    .then(function(){
                        createTables()
                            .then(function(){
                                console.log("Dropped and created the tables.")

                                // regeneate the declarations
                                generateSqlDefinition(sqlOptions, function(err, stats) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    fs.writeFileSync("./database/management/declarations.js", stats.buffer);
                                });

                            }).catch(function(err){
                                console.error("Couldn't create tables", err);
                            });
                    }).catch(function(err){
                        console.error("Couldn't drop tables", err);
                    });         

                    })
            .catch(function(err){
                console.error("Couldn't connect tables", err);
            });


    }, 1000);
   
});

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
    var serverWatcher = gulp.watch(['./server/**', './database/**'], function(){
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

