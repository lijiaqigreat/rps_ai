// 'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var browserSync=require('browser-sync');
var LessPluginCleanCSS = require("less-plugin-clean-css");

var reload=browserSync.reload;
var cleancss = new LessPluginCleanCSS({advanced: true});

var ext_replace=require('gulp-ext-replace');
gulp.task('clean', function(cb)
{
});

gulp.task('less', function () {
  gulp.src('./less/main.less')
  .pipe($.less({
    plugins:[cleancss]
  }))
  .pipe($.uncss({
    html:["index.html"],
    ignore: [".svg_rps",".svg_rps .svg_back",".gr_1i1",".gr_1i1",".gr_1i0",".gr_0i0",]
  }))
  .pipe(gulp.dest(__dirname+'/css'));
});
gulp.task("js",function(){
  $.requirejs({
    name: "js/main.js",
    baseUrl: '.',
    out:"main.min.js",
    paths: {
        'underscore': 'vendor/underscore.min',
        'Promise': 'vendor/promise-6.0.0.min'
    },

    shim: {
        'underscore': {
          exports: '_'
        },
        'Promise': {
          exports: 'Promise'
        }
    }
  })
  .pipe($.uglify())
  .pipe(gulp.dest("js/"));

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
    notify: false,
    server: {
      baseDir: ["./"]
    },
    port:80 
  });
});

gulp.task('serve', ['build','serve_test'], function () {
  gulp.watch(['less/**'],['less',reload]);
  gulp.watch(['index.html','js/**','css/**','bots/**','asset/**','vendor/**'], reload);
  gulp.watch(['doc/*.md'],['doc',reload]);
});
