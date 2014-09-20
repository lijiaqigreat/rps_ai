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

gulp.task('clean', function(cb) {
  $.cached.caches={};
});

gulp.task('build',function(){
  runSequence([]);
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
  gulp.watch(['index.html','js','css','bots','asset','vender'], [reload]);
});
