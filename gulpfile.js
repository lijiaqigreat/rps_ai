// 'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var SRC='src';
var DIST='dist';
var jade_json_name='json';

gulp.task('jshint', function(){
  return gulp.src(SRC+'/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});
gulp.task('js', function () {
  return gulp.src(SRC+'/**/*.js')
    .pipe($.cached('js',['optimizeMemory']))
    //.pipe($.uglify())
    .pipe($.concat('all.js'))
    .pipe(gulp.dest('./'))
    .pipe($.size({title: 'js'}));
});

gulp.task('clean', function(cb) {
  $.cached.caches={};
});

gulp.task('build',function(){
  runSequence(['js']);
});


// Watch Files For Changes & Reload
// Build and serve the output from the dist build
gulp.task('serve', ['build'], function () {
  browserSync({
    notify: false,
    server: {
      baseDir: ['./']
    }
  });
  gulp.watch([SRC+'/**/*.js'], ['js',reload]);
});
