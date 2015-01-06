var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    sass = require('gulp-ruby-sass'),
    autoprefix = require('gulp-autoprefixer'),
    notify = require('gulp-notify');

var config = {
  sassPath: './src/sass',
  cssPath: './public/stylesheets'
};

gulp.task('default', ['test']);

gulp.task('watch', function () {
  gulp.watch(config.sassPath + '/**/*.scss', ['compile-sass']);
});

gulp.task('test', function () {
  return gulp.src('test.js', {read: false})
        .pipe(mocha({reporter: 'dot'}));
});

gulp.task('compile-sass', function () {
  return gulp.src(config.sassPath + '/style.scss')
  .pipe(sass({
    style: 'compressed',
    loadPath: [config.sassPath],
    "sourcemap=none": true
  })
  .on("error", notify.onError(function (error) {
    return "Error: " + error.message;
  })))
  .pipe(autoprefix('last 2 version'))
  .pipe(gulp.dest(config.cssPath));
});