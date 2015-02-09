var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    sass = require('gulp-ruby-sass'),
    autoprefix = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

var config = {
  appPath: '.',
  cssPath: './public/stylesheets',
  sassPath: './src/sass'
};

gulp.task('default', ['serve']);

gulp.task('serve', function () {
  nodemon({
    script: 'index.js', 
    ext: 'js jade scss',
    env: {'NODE_ENV': 'development'}
  })
  .on('start', ['watch'])
  .on('change', ['watch']);
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

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(config.sassPath + '/**/*.scss', ['compile-sass']);
});