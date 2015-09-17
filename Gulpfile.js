var gulp = require('gulp');
var async = require('async');

gulp.task('build', function (done) {
  var metalsmith = require('metalsmith');
  var path = require('metalsmith-path');
  var helpers = require('metalsmith-register-helpers');
  var markdown = require('metalsmith-markdown');
  var permalinks = require('metalsmith-permalinks');
  var collections = require('metalsmith-collections');
  var layouts = require('metalsmith-layouts');

  async.series({
    metalsmith: function (done) {
      metalsmith(__dirname)
        .use(markdown())
        .use(permalinks({
          pattern: 'posts/:date/:title'
        }))
        .use(path())
        .use(collections({
          'posts': {
            sortBy: 'date',
            reverse: true
          }
        }))
        .use(helpers({
          directory: 'src/_helpers'
        }))
        .use(layouts({
          engine: 'handlebars'
        }))
        .build(done);
    },
    assets: function(done) {
      gulp.src('assets/**/*')
        .pipe(gulp.dest('build/assets'))
        .on('end', done);
    }
  }, done);
});

gulp.task('server', ['build'], function () {
  var webserver = require('gulp-webserver');

  gulp.watch(['src/**/*.*', 'layouts/**/*.*', 'assets/**/*.*'], ['build']);

  return gulp.src('build')
    .pipe(webserver({ livereload: true }));
});

gulp.task('default', ['build']);
