// 'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var browserSync=require('browser-sync');
var reload=browserSync.reload;

var ext_replace=require('gulp-ext-replace');
/*
gulp.task('clean', function(cb)
{
});

gulp.task('less', function () {
  gulp.src('./less/main.less')
  .pipe($.less({
  }))
  .pipe(gulp.dest(__dirname+'/css'));
});

gulp.task('doc',function()
{
  var header=fs.readFileSync(__dirname + '/doc/header.html').toString();
  var footer=fs.readFileSync(__dirname + '/doc/footer.html').toString();
  gulp.src('doc/*.md')
  .pipe($.marked())
  .pipe($.wrapper({
    header:header,
    footer:footer
  }))
  .pipe(ext_replace('.html'))
  .pipe(gulp.dest('doc'));
});
*/

//gulp.task('build',['doc','less'],function(){
gulp.task('build',function(){
});
//TODO
/*
gulp.task('js',function()
{
  gulp.src('js/main.js')
  //.pipe($.uglify())
  .pipe($.rename("app.js"))
  .pipe(gulp.dest('js'));
});
*/
// Watch Files For Changes & Reload
// Build and serve the output from the dist build
gulp.task('serve_test', function() {
    browserSync({
        server: {
            baseDir: ["./"]
        },
        port: 3000
    });
});

gulp.task('serve', ['build','serve_test'], function () {
  //gulp.watch(['less/**'],['less',reload]);
  gulp.watch(['index.html'],[browserSync.reload]);
  //gulp.watch(['index.html','js/**','css/**','bots/**','asset/**','vendor/**'], [reload]);
  //gulp.watch(['doc/*.md'],['doc',reload]);
});
