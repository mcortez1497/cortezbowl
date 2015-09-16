var gulp = require('gulp');

gulp.task('build', function () {
  var metalsmith = require('metalsmith');
  var collections = require('metalsmith-collections');
  var layouts = require('metalsmith-layouts');

  metalsmith(__dirname)
  .use(layouts({
    engine: 'handlebars'
  }))
  .build(function(err) {
    if (err) throw err;
  });
});

gulp.task('server', ['build'], function () {
  var webserver = require('gulp-webserver');

  gulp.watch(['src/**/*.*', 'layouts/**/*.*', 'assets/**/*.*'], ['build']);

  return gulp.src('build')
    .pipe(webserver({ livereload: true }));
});

gulp.task('default', ['build']);
