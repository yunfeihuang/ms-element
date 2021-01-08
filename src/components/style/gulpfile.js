'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var fs = require('fs')
var path = require('path')

gulp.task('compile', function() {
  return gulp.src('./src/theme/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      overrideBrowserslist: ['> 0.15% in CN'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('../../../lib/style/theme'));
});

gulp.task('copyfont', function() {
  return gulp.src('./src/iconfont/**')
    .pipe(cssmin())
    .pipe(gulp.dest('../../../lib/style/iconfont'));
});

gulp.task('copythemesrc', function() {
  return gulp.src('./src/**')
    .pipe(gulp.dest('../../../lib/style/src'));
});
gulp.task('copy-element-style', function() {
  return gulp.src('../../../src/element-ui/index.scss')
    .pipe(gulp.dest('../../../lib/element-ui'));
});

gulp.task('clear-var', function (done) {
  let dir = '../../../lib/style/src/theme'
  fs.readdir(dir, function (err,files) {
    files.forEach(function(filename){
      var fileDir = path.join(dir, filename);
      var content = fs.readFileSync(fileDir, 'utf-8');
      fs.writeFileSync(fileDir, content.replace("@import '../variable.scss';", '').replace("@import '../mixins.scss';", ''))
    });
    done()
  });
});
gulp.task('async-element-vars', function (done) {
  let dir = '../../../lib/style/src/theme/common'
  fs.readdir(dir, function (err,files) {
    files.forEach(function(filename){
      var fileDir = path.join(dir, filename);
      var content = fs.readFileSync(fileDir, 'utf-8');
      fs.writeFileSync(fileDir, content.replace("@import '../../../../../../node_modules/element-ui/packages/theme-chalk/src/common/var.scss';", "@import 'element-ui/packages/theme-chalk/src/common/var.scss';"))
    });
    done()
  });
});


gulp.task('build', gulp.series('compile', 'copyfont', 'copythemesrc', 'copy-element-style', 'async-element-vars', done => done()))