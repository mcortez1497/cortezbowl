var gulp = require('gulp');
var async = require('async');
var argv = require('yargs')
  .default('baseUri', '/')
  .argv;

gulp.task('build', function (done) {
  var metalsmith = require('metalsmith');
  var path = require('metalsmith-path');
  var markdown = require('metalsmith-markdown');
  var permalinks = require('metalsmith-permalinks');
  var collections = require('metalsmith-collections');
  var dateFormatter = require('metalsmith-date-formatter');
  var templates = require('metalsmith-in-place');
  var layouts = require('metalsmith-layouts');

  async.series({
    metalsmith: function (done) {
      metalsmith(__dirname)
        .metadata({ baseUri: argv.baseUri })
        .use(templates({
          engine: 'handlebars'
        }))
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
        .use(dateFormatter({
          dates: [{
            key: 'date',
            format: 'MMMM Do YYYY'
          }]
        }))
        .use(layouts({
          engine: 'handlebars',
          partials: {
            'header': '../src/_partials/header',
          }
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
