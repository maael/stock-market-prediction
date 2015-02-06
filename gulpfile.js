var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    sass = require('gulp-ruby-sass'),
    autoprefix = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect');

var config = {
  appPath: '.',
  cssPath: './public/stylesheets',
  sassPath: './src/sass'
};

gulp.task('default', ['connect', 'watch']);

gulp.task('watch', function () {
  gulp.watch(config.sassPath + '/**/*.scss', ['compile-sass']);
  gulp.watch(config.appPath, ['serve']);
});

gulp.task('connect', function () {
  connect.server({
    root: config.appPath,
    livereload: true
  });
});

gulp.task('serve', function () {
  gulp.src('.')
  .pipe(connect.reload());
});

gulp.task('test', function () {
  return gulp.src('test.js', {read: false})
        .pipe(mocha({reporter: 'dot'}));
});

gulp.task('compile-sass', function () {
  return gulp.src(config.sassPath + '/*.scss')
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