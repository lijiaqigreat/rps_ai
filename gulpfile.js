// 'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var ext_replace=require('gulp-ext-replace');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');

var fs = require('fs');
var SRC='src';
var DIST='dist';

gulp.task('clean', function(cb)
{
  cached.caches={};
});

//gulp.task('css', function () 
//{
//  src.styles = 'css/**/*.{css,less}';
//  return gulp.src('src/styles/bootstrap.less')
//    .pipe($.plumber())
//    .pipe($.less({sourceMap: !RELEASE, sourceMapBasepath: __dirname}))
//    .on('error', $.util.log)
//    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
//    .pipe($.csscomb())
//    .pipe($.if(RELEASE, $.minifyCss()))
//    .pipe(gulp.dest(DEST + '/css'))
//    .pipe($.if(watch, reload({stream: true})));
//});

gulp.task('doc',function()
{
  var header=fs.readFileSync(__dirname + '/doc/header.html').toString();
  var footer=fs.readFileSync(__dirname + '/doc/footer.html').toString();
  gulp.src('doc/**/*.md')
  .pipe($.marked())
  .pipe($.wrapper({
    header:header,
    footer:footer
  }))
  .pipe(ext_replace('.html'))
  .pipe(gulp.dest('doc'));
});

gulp.task('build',['doc'],function(){
});
gulp.task('test', function() {
  return gulp.src(specFiles).pipe(jasminePhantomJs());
});
gulp.task('js',function()
{
  gulp.src('js/main.js')
  .pipe($.browserify())
  //.pipe($.uglify())
  .pipe($.rename("app.js"))
  .pipe(gulp.dest('js'));
});
gulp.task('test-js', function()
{
  gulp.src('test/test.js')
  .pipe($.browserify())
  .pipe($.rename("test.min.js"))
  .pipe(gulp.dest('test'));
});
gulp.task('test', ['test-js'], function(){
  gulp.watch(['js/**/*.js','test/**/*.js'], ['test-js']);
});

gulp.task('example', function()
{
  return gulp.src('tmp_example/specrunner.html').pipe(jasminePhantomJs());
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
  gulp.watch(['index.html','js','css','bots','asset','vendor'], [reload]);
  gulp.watch(['doc/*.md'],['doc',reload]);
});
