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
gulp.task('css', function () {
  src.styles = 'css/**/*.{css,less}';
  return gulp.src('src/styles/bootstrap.less')
    .pipe($.plumber())
    .pipe($.less({sourceMap: !RELEASE, sourceMapBasepath: __dirname}))
    .on('error', $.util.log)
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.csscomb())
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest(DEST + '/css'))
    .pipe($.if(watch, reload({stream: true})));
});

gulp.task('build',function(){
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
