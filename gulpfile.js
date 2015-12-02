'use strict';

require('es6-shim');

var spawn = require('child_process').spawn;
var path = require('path'); 
var join = path.join;

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babel = require('gulp-babel');

function browserifyBundle(opts){
    opts = opts || {}

    return new Promise(function(resolve, reject){
        var debug = opts.debug || process.env.NODE_ENV === 'development';
                
        var bOptions = Object.assign(
            {
                cache: {},
                packageCache: {},
                fullPaths: true,
                debug: debug,
                transform: ['reactify'],
                entries: join(__dirname, 'src', 'main.js')
            },
            opts
        );
                
        var b = browserify(bOptions);
        
        if(!debug){
            b.plugin('minifyify', {map: false});
        }
        
        b.bundle()
        .pipe(source( join(__dirname, 'src', 'browserify-bundle.js') ) )
        .pipe(gulp.dest('.'))
        .on('error', function (err) {
            console.error('browserifyBundle error', err.message);
            reject(err);
        })
        .on('end', function(){
            resolve();
        });
    });
}

gulp.task('build-client', function(){
    return browserifyBundle({debug: false});
});

gulp.task('build-server', function(){
    return gulp.src('src/views/*.jsx')
    .pipe(babel({
        presets: ['react']
    }))
    .pipe(gulp.dest('src/views'));
});

gulp.task('watch-client', function() {
    console.log('Watching client');
    
    var watcher = gulp.watch(
        [
            './src/js/**',
            './src/main.js',
            './src/views/*.jsx'
        ]
    );
    watcher.on('change', function(event) {
        console.log('** Client ** File ' + path.relative(__dirname, event.path) + ' was ' + event.type);
        return browserifyBundle().then(function(){
            console.log('watch-client done');
        });
    });
});

gulp.task('watch-server', function() {
    console.log('Watching for server changes (jsx files compiled for server-side rendering)');
    
    var watcher = gulp.watch('./src/views/*.jsx', ['build-server']);
    watcher.on('change', function(event) {
        console.log('** Server ** File ' + path.relative(__dirname, event.path) + ' was ' + event.type);
    });
});

gulp.task('watch', ['watch-client', 'watch-server']);
gulp.task('build', ['build-client', 'build-server']);

gulp.task('start-containers-dev', ['build'], function(){
    spawn('docker-compose', ['-f', 'compose-dev.yml', 'up', '-d', '--force-recreate'], {stdio: 'inherit'});
});

gulp.task('start-containers-prod', ['build'], function(){
    spawn('docker-compose', ['-f', 'compose-prod.yml', 'up', '-d', '--force-recreate'], {stdio: 'inherit'});
});


/*
    Top-level tasks
*/

gulp.task('dev', ['start-containers-dev', 'watch']);
gulp.task('prod', ['start-containers-prod']);

