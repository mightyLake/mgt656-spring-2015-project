// Gulpfile.js - We use Gulp to monitor our files and
// do two things when we make changes to the code:
// 1) check it for errors ("lint it") and 2) restart
// the application.

'use strict';

var fs = require('fs');

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var mainBowerFiles = require('main-bower-files');
var install = require('gulp-install');

gulp.task('lint', function () {
  gulp.src(['*.js', 'controllers/**/*.js',
            'models/**/*.js', '!./node_modules/**', '!./.*'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Compile the bower files.
gulp.task('bower', function () {
  gulp.src(mainBowerFiles(), { base : 'bower_components' })
    .pipe(gulp.dest('public/vendor/'));
});

gulp.task('debug', ['bower', 'lint'], function () {
  nodemon({
      script: 'start-app.js',
      ext: 'js html',
      nodeArgs: ['--debug'],
      ignore: ['node_modules/**', '.c9/*'],
      debug: true
    })
    .on('change', ['bower', 'lint'])
    .on('restart', function () {
      console.log('restarted!');
    });
});

gulp.task('default', ['bower', 'lint'], function () {
  nodemon({
      script: 'start-app.js',
      ext: 'js html',
      ignore: ['node_modules/**', '.c9/*']
    })
    .on('change', ['bower', 'lint'])
    .on('restart', function () {
      console.log('restarted!');
    });
});

