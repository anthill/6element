"use strict";

require('es6-shim');
var spawn = require('child_process').spawn;
//
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

gulp.task('init', function () {                                 

    // wait database to be created 
    var interval = setInterval(function(){

        console.log("checking for connection.");

        require('./database/management/databaseClientP')
        .then(function(){
            clearInterval(interval);

            // when ready, drop and create tables
            var dropAllTables = require('./database/management/dropAllTables.js');
            var createTables = require('./database/management/createTables.js');
            var hardCodedSensors = require("./server/hardCodedSensors.js");

            dropAllTables()
            .then(function(){
                createTables()
                .then(function(){   
                    if (!process.env.BACKUP) {
                        console.log('no backup file');
                        generateDefinitions()
                        .then(function(){
                            console.log("Dropped and created the tables.")
                            hardCodedSensors();
                        })
                        .catch(function(err){
                            console.error("Couldn't write the schema", err);
                        });
                    }
                    else {
                        generateDefinitions()
                        .then(console.log('definitions generated'))
                        .catch(function(err){
                            console.error("Couldn't write the schema", err);
                        });
                    }

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

gulp.task('watch-dashboard', function() {
    console.log('Watching');
    gulp.watch(['./server/**', './database/**'], function(){
        server.stop();
        gulp.run('serve-dashboard');
    });

    var dashboardWatcher = gulp.watch('./clients/Dashboard/src/**', ['build-dashboard']);

    dashboardWatcher.on('change', function(event) {
        console.log('*** Dashboard *** File ' + event.path + ' was ' + event.type + ', running tasks...');
        // livereload.changed(event.path)
    });
});

gulp.task('watch-admin', function() {
    console.log('Watching admin');
    gulp.watch(['./server/**', './database/**'], function(){
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

gulp.task('dashboard-dev', ['build-dashboard', 'serve-dashboard'/*, 'watch-dashboard'*/], function(){
    console.log('Starting dashboard in dev');
});

gulp.task('citizen-dev', ['build-citizen', 'serve-citizen'], function(){
    console.log('Starting citizen in dev');
});



gulp.task('admin-prod', ['serve-admin', 'build-admin']);

gulp.task('dashboard-prod', ['serve-dashboard', 'build-dashboard']);

gulp.task('citizen-prod', ['build-citizen', 'serve-citizen']);
