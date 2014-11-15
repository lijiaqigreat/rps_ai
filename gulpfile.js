// 'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var karma= require('karma').server;
var fs = require('fs');

var ext_replace=require('gulp-ext-replace');
/*


*/
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('clean', function(cb)
{
  cached.caches={};
});

gulp.task('less', function () {
  gulp.src('./less/main.less')
  .pipe($.less({
  }))
  .pipe(gulp.dest(__dirname+'/css/main.compile.css'));
});

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
gulp.task('js',function()
{
  gulp.src('js/main.js')
  //.pipe($.uglify())
  .pipe($.rename("app.js"))
  .pipe(gulp.dest('js'));
});
gulp.task('test-js', function()
{
  gulp.src('test/test.js')
  .pipe($.rename("test.min.js"))
  .pipe(gulp.dest('test'));
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
