var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    sass = require('gulp-ruby-sass'),
    autoprefix = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    nodemon = require('gulp-nodemon'),
    refresh = require('gulp-livereload'),
    server = require('tiny-lr')(),
    lrPort = 35729;

var config = {
  appPath: '.',
  cssPath: './public/stylesheets',
  sassPath: './src/sass'
};

gulp.task('default', ['lr', 'serve']);

gulp.task('serve', function () {
  nodemon({
    script: 'index.js', 
    ext: 'js html jade sass',
    env: {'NODE_ENV': 'development'}
  })
  .on('change', ['compile-sass', ['refresh']]);
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

gulp.task('refresh', function() {
  return gulp.src(appPath)
  .pipe(refresh(server));
});

gulp.task('lr', function() {
  server.listen(lrPort, function(err) {
    if(err) { return console.error(err); }
  });
});